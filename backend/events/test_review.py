from io import BytesIO, StringIO
from tempfile import TemporaryDirectory

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.db import IntegrityError, transaction
from django.db.models.deletion import ProtectedError
from django.test import override_settings
from django.urls import reverse
from django.utils import timezone
from PIL import Image
from rest_framework.test import APITestCase

from bookings.models import EventRegistration
from events.models import Event
from events.validators import MAX_EVENT_IMAGE_SIZE


User = get_user_model()


class EventReviewTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.organizer = User.objects.create_user(
            email="review-organizer@example.com", role=User.Role.ORGANIZER
        )
        self.attendee = User.objects.create_user(email="review-attendee@example.com")
        self.client.force_authenticate(user=self.organizer)
        self.payload = {
            "title": "Review event",
            "description": "An event for regression tests.",
            "starts_at": timezone.now() + timezone.timedelta(days=10),
            "ends_at": timezone.now() + timezone.timedelta(days=10, hours=2),
            "location": {"city": "Kyiv", "venue": "Concert Hall"},
            "price": "25.00",
            "total_seats": 3,
        }
        self.event = Event.objects.create(
            **self.payload, organizer=self.organizer, available_seats=3
        )
        self.url = reverse("event-detail", kwargs={"pk": self.event.pk})

    def register_attendee(self):
        registration = EventRegistration.objects.create(event=self.event, user=self.attendee)
        self.event.available_seats -= 1
        self.event.save(update_fields=["available_seats"])
        return registration

    def test_create_initializes_seats_and_ignores_client_seat_count(self):
        for supplied in ({}, {"available_seats": 0}, {"available_seats": 999}):
            with self.subTest(supplied=supplied):
                response = self.client.post(
                    reverse("event-list"), {**self.payload, **supplied}, format="json"
                )
                self.assertEqual(response.status_code, 201, response.data)
                self.assertEqual(response.data["available_seats"], 3)
                self.assertEqual(response.data["organizer_id"], self.organizer.pk)
                self.assertNotIn("organizer", response.data)
                self.assertNotIn("date", response.data)

    def test_client_cannot_overwrite_seats_or_organizer(self):
        self.register_attendee()
        response = self.client.patch(
            self.url,
            {"available_seats": 3, "organizer_id": self.attendee.pk},
            format="json",
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.event.refresh_from_db()
        self.assertEqual(self.event.available_seats, 2)
        self.assertEqual(self.event.organizer_id, self.organizer.pk)

    def test_capacity_changes_preserve_existing_registrations(self):
        self.register_attendee()
        for capacity, available in ((5, 4), (1, 0), (4, 3)):
            with self.subTest(capacity=capacity):
                response = self.client.patch(self.url, {"total_seats": capacity}, format="json")
                self.assertEqual(response.status_code, 200, response.data)
                self.assertEqual(response.data["available_seats"], available)
                self.assertEqual(self.event.registrations.count(), 1)

    def test_capacity_cannot_fall_below_registrations(self):
        self.register_attendee()
        other = User.objects.create_user(email="review-second@example.com")
        EventRegistration.objects.create(event=self.event, user=other)
        Event.objects.filter(pk=self.event.pk).update(available_seats=1)
        response = self.client.patch(self.url, {"total_seats": 1}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("total_seats", response.data)
        self.event.refresh_from_db()
        self.assertEqual((self.event.total_seats, self.event.available_seats), (3, 1))

    def test_capacity_constraints_are_enforced_by_database(self):
        for changes in ({"total_seats": 0}, {"available_seats": 4}):
            with self.subTest(changes=changes), self.assertRaises(IntegrityError), transaction.atomic():
                Event.objects.filter(pk=self.event.pk).update(**changes)

    def test_delete_deactivates_event_and_preserves_registration(self):
        registration = self.register_attendee()
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 204)
        self.event.refresh_from_db()
        self.assertFalse(self.event.is_active)
        self.assertTrue(EventRegistration.objects.filter(pk=registration.pk).exists())
        self.assertEqual(self.client.get(reverse("event-list")).data["count"], 0)
        self.client.force_authenticate(user=self.attendee)
        response = self.client.get(reverse("registration-list"))
        summary = response.data["results"][0]["event"]
        self.assertEqual(summary["id"], self.event.pk)
        self.assertFalse(summary["is_active"])
        self.assertEqual(self.client.get(self.url).status_code, 200)
        self.client.force_authenticate(user=None)
        self.assertEqual(self.client.get(self.url).status_code, 401)

    def test_hard_delete_of_registered_event_or_organizer_is_protected(self):
        self.register_attendee()
        with self.assertRaises(ProtectedError):
            self.event.delete()
        with self.assertRaises(ProtectedError):
            self.organizer.delete()
        self.assertTrue(Event.objects.filter(pk=self.event.pk).exists())

    def test_other_organizer_cannot_deactivate_event(self):
        other = User.objects.create_user(email="review-other@example.com", role=User.Role.ORGANIZER)
        self.client.force_authenticate(user=other)
        self.assertEqual(self.client.delete(self.url).status_code, 403)
        self.event.refresh_from_db()
        self.assertTrue(self.event.is_active)

    def test_admin_can_deactivate_event(self):
        admin = User.objects.create_user(email="review-admin@example.com", role=User.Role.ADMIN)
        self.client.force_authenticate(user=admin)
        self.assertEqual(self.client.delete(self.url).status_code, 204)
        self.event.refresh_from_db()
        self.assertFalse(self.event.is_active)

    def test_past_event_can_be_edited_with_unchanged_timestamps(self):
        starts_at = timezone.now() - timezone.timedelta(days=2)
        ends_at = starts_at + timezone.timedelta(hours=2)
        Event.objects.filter(pk=self.event.pk).update(starts_at=starts_at, ends_at=ends_at)
        for method in (self.client.patch, self.client.put):
            with self.subTest(method=method.__name__):
                response = method(
                    self.url,
                    {**self.payload, "title": "Corrected title", "starts_at": starts_at,
                     "ends_at": ends_at, "is_active": False},
                    format="json",
                )
                self.assertEqual(response.status_code, 200, response.data)
        self.event.refresh_from_db()
        self.assertEqual(self.event.title, "Corrected title")
        self.assertFalse(self.event.is_active)

    def test_new_or_changed_past_timestamps_are_rejected(self):
        past = timezone.now() - timezone.timedelta(days=2)
        for field in ("starts_at", "ends_at"):
            with self.subTest(field=field):
                response = self.client.patch(self.url, {field: past}, format="json")
                self.assertEqual(response.status_code, 400)
                self.assertIn(field, response.data)
        response = self.client.post(
            reverse("event-list"), {**self.payload, "starts_at": past}, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_past_timestamps_returned_by_api_can_be_sent_back_unchanged(self):
        starts_at = timezone.now() - timezone.timedelta(days=2)
        Event.objects.filter(pk=self.event.pk).update(
            starts_at=starts_at, ends_at=starts_at + timezone.timedelta(hours=2)
        )
        detail = self.client.get(self.url).data
        response = self.client.patch(
            self.url,
            {"starts_at": detail["starts_at"], "ends_at": detail["ends_at"], "is_active": False},
            format="json",
        )
        self.assertEqual(response.status_code, 200, response.data)

    def test_start_is_required_and_end_must_follow_start(self):
        for changes in ({"starts_at": None}, {"ends_at": self.payload["starts_at"]}):
            with self.subTest(changes=changes):
                response = self.client.post(
                    reverse("event-list"), {**self.payload, **changes}, format="json"
                )
                self.assertEqual(response.status_code, 400)
        payload = {**self.payload}
        del payload["starts_at"]
        response = self.client.post(reverse("event-list"), payload, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("starts_at", response.data)

    def test_public_and_organizer_lists_order_by_start_time(self):
        earlier = Event.objects.create(
            **{**self.payload, "starts_at": self.payload["starts_at"] - timezone.timedelta(days=1)},
            organizer=self.organizer, available_seats=3,
        )
        for name in ("event-list", "my-events-list"):
            for ordering, expected in (("starts_at", [earlier.pk, self.event.pk]),
                                       ("-starts_at", [self.event.pk, earlier.pk])):
                with self.subTest(name=name, ordering=ordering):
                    response = self.client.get(reverse(name), {"ordering": ordering})
                    self.assertEqual([item["id"] for item in response.data["results"]], expected)

    def test_location_requires_online_or_typed_nonempty_bounded_fields(self):
        invalid_locations = [
            "Kyiv", "Online", "", [], 7, True, None, {}, {"city": "Kyiv"},
            {"city": 5, "venue": "Hall"}, {"city": "Kyiv", "venue": False},
            {"city": " ", "venue": "Hall"}, {"city": "Kyiv", "venue": []},
            {"city": "x" * 101, "venue": "Hall"},
            {"city": "Kyiv", "venue": "x" * 256},
        ]
        for location in invalid_locations:
            with self.subTest(location=location):
                response = self.client.patch(self.url, {"location": location}, format="json")
                self.assertEqual(response.status_code, 400, response.data)
                self.assertIn("location", response.data)

    def test_valid_locations_are_normalized(self):
        for location, expected in (("online", "online"),
            ({"city": " Kyiv ", "venue": " Hall "}, {"city": "Kyiv", "venue": "Hall"})):
            with self.subTest(location=location):
                response = self.client.patch(self.url, {"location": location}, format="json")
                self.assertEqual(response.status_code, 200, response.data)
                self.assertEqual(response.data["location"], expected)

    def image_file(self, name="event.png", image_format="PNG", content_type="image/png", padding=0):
        stream = BytesIO()
        Image.new("RGB", (2, 2)).save(stream, format=image_format)
        return SimpleUploadedFile(name, stream.getvalue() + b"x" * padding, content_type=content_type)

    def test_valid_image_formats_work_with_multipart_location(self):
        with TemporaryDirectory() as media_root, override_settings(MEDIA_ROOT=media_root):
            for name, image_format, mime in (("event.jpg", "JPEG", "image/jpeg"),
                ("event.png", "PNG", "image/png"), ("event.webp", "WEBP", "image/webp")):
                with self.subTest(image_format=image_format):
                    response = self.client.patch(
                        self.url,
                        {"image": self.image_file(name, image_format, mime),
                         "location": '{"city":"Kyiv","venue":"Hall"}'},
                        format="multipart",
                    )
                    self.assertEqual(response.status_code, 200, response.data)
                    self.assertIn("/events/", response.data["image"])

    def test_invalid_oversized_or_disguised_images_are_rejected(self):
        uploads = [
            self.image_file(padding=MAX_EVENT_IMAGE_SIZE),
            self.image_file("event.gif", "GIF", "image/gif"),
            self.image_file("event.jpg"),
            SimpleUploadedFile("event.png", b"not an image", content_type="image/png"),
        ]
        for upload in uploads:
            with self.subTest(name=upload.name, size=upload.size):
                response = self.client.patch(self.url, {"image": upload}, format="multipart")
                self.assertEqual(response.status_code, 400, response.data)
                self.assertIn("image", response.data)

    def test_seed_rerun_preserves_bookings_and_recomputes_seats(self):
        call_command("seed_data", stdout=StringIO())
        event = Event.objects.get(title="Kyiv Rock Festival 2026")
        registration = EventRegistration.objects.create(event=event, user=self.attendee)
        call_command("seed_data", stdout=StringIO())
        event.refresh_from_db()
        self.assertEqual(event.available_seats, event.total_seats - 1)
        self.assertTrue(EventRegistration.objects.filter(pk=registration.pk).exists())
