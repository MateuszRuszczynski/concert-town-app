from concurrent.futures import ThreadPoolExecutor
from threading import Barrier

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.db import close_old_connections
from django.http import Http404
from django.test import TransactionTestCase, skipUnlessDBFeature
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient, APITestCase

from bookings.models import EventRegistration
from bookings.views import EventCancelRegistration
from events.models import Event


User = get_user_model()


class CancellationReviewTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(email="cancel-attendee@example.com")
        self.organizer = User.objects.create_user(
            email="cancel-organizer@example.com", role=User.Role.ORGANIZER
        )
        self.event = Event.objects.create(
            title="Original title", description="Description",
            starts_at=timezone.now() + timezone.timedelta(days=10),
            price="10.00", total_seats=2, available_seats=1,
            location="online", organizer=self.organizer,
        )
        self.registration = EventRegistration.objects.create(event=self.event, user=self.user)
        self.client.force_authenticate(user=self.user)
        self.url = reverse("registration-cancel", kwargs={"pk": self.registration.pk})

    def test_stale_registration_cannot_overwrite_concurrent_event_edit(self):
        stale = EventRegistration.objects.select_related("event").get(pk=self.registration.pk)
        Event.objects.filter(pk=self.event.pk).update(title="Updated title", total_seats=5, available_seats=4)
        EventCancelRegistration().perform_destroy(stale)
        self.event.refresh_from_db()
        self.assertEqual(self.event.title, "Updated title")
        self.assertEqual((self.event.total_seats, self.event.available_seats), (5, 5))

    def test_cancel_at_or_after_start_preserves_booking_and_seats(self):
        for delta in (timezone.timedelta(), timezone.timedelta(days=-1)):
            with self.subTest(delta=delta):
                Event.objects.filter(pk=self.event.pk).update(starts_at=timezone.now() + delta)
                response = self.client.delete(self.url)
                self.assertEqual(response.status_code, 400, response.data)
                self.assertTrue(EventRegistration.objects.filter(pk=self.registration.pk).exists())
                self.event.refresh_from_db()
                self.assertEqual(self.event.available_seats, 1)

    def test_future_inactive_event_can_be_canceled(self):
        Event.objects.filter(pk=self.event.pk).update(is_active=False)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 200, response.data)
        self.event.refresh_from_db()
        self.assertEqual(self.event.available_seats, 2)

    def test_repeated_stale_cancellation_returns_seat_only_once(self):
        stale = EventRegistration.objects.get(pk=self.registration.pk)
        self.assertEqual(self.client.delete(self.url).status_code, 200)
        with self.assertRaises(Http404):
            EventCancelRegistration().perform_destroy(stale)
        self.event.refresh_from_db()
        self.assertEqual(self.event.available_seats, 2)


@skipUnlessDBFeature("has_select_for_update")
class BookingConcurrencyTests(TransactionTestCase):
    def setUp(self):
        cache.clear()
        self.organizer = User.objects.create_user(
            email="concurrent-organizer@example.com", role=User.Role.ORGANIZER
        )
        self.users = [User.objects.create_user(email=f"concurrent-{index}@example.com") for index in range(2)]
        self.event = Event.objects.create(
            title="Concurrent event", description="Description", location="online",
            starts_at=timezone.now() + timezone.timedelta(days=10),
            price="10.00", total_seats=1, available_seats=1, organizer=self.organizer,
        )

    def run_concurrently(self, *actions):
        barrier = Barrier(len(actions))

        def worker(action):
            close_old_connections()
            try:
                barrier.wait(timeout=10)
                return action()
            finally:
                close_old_connections()

        with ThreadPoolExecutor(max_workers=len(actions)) as pool:
            futures = [pool.submit(worker, action) for action in actions]
            return [future.result(timeout=20) for future in futures]

    def register(self, user):
        client = APIClient()
        client.force_authenticate(user=user)
        return client.post(reverse("registration-create"), {"event_id": self.event.pk}).status_code

    def test_only_one_concurrent_request_can_book_the_last_seat(self):
        responses = self.run_concurrently(
            lambda: self.register(self.users[0]), lambda: self.register(self.users[1])
        )
        self.assertCountEqual(responses, [201, 400])
        self.event.refresh_from_db()
        self.assertEqual(self.event.available_seats, 0)
        self.assertEqual(self.event.registrations.count(), 1)

    def test_concurrent_capacity_reduction_cannot_oversell(self):
        Event.objects.filter(pk=self.event.pk).update(total_seats=2, available_seats=2)
        self.assertEqual(self.register(self.users[0]), 201)

        def reduce_capacity():
            client = APIClient()
            client.force_authenticate(user=self.organizer)
            return client.patch(
                reverse("event-detail", kwargs={"pk": self.event.pk}),
                {"total_seats": 1}, format="json",
            ).status_code

        responses = self.run_concurrently(lambda: self.register(self.users[1]), reduce_capacity)
        self.assertIn(responses, ([201, 400], [400, 200]))
        self.event.refresh_from_db()
        self.assertEqual(self.event.available_seats, self.event.total_seats - self.event.registrations.count())

    def test_concurrent_stale_cancellations_return_only_one_seat(self):
        self.assertEqual(self.register(self.users[0]), 201)
        registration = self.event.registrations.get()

        def cancel_stale():
            stale = EventRegistration(pk=registration.pk, event_id=self.event.pk, user=self.users[0])
            try:
                EventCancelRegistration().perform_destroy(stale)
                return 200
            except Http404:
                return 404

        responses = self.run_concurrently(cancel_stale, cancel_stale)
        self.assertCountEqual(responses, [200, 404])
        self.event.refresh_from_db()
        self.assertEqual(self.event.available_seats, 1)
        self.assertEqual(self.event.registrations.count(), 0)

    def test_concurrent_edit_and_cancellation_preserve_both_changes(self):
        self.assertEqual(self.register(self.users[0]), 201)
        registration = self.event.registrations.get()

        def edit_event():
            client = APIClient()
            client.force_authenticate(user=self.organizer)
            return client.patch(
                reverse("event-detail", kwargs={"pk": self.event.pk}),
                {"title": "Edited title", "total_seats": 4}, format="json",
            ).status_code

        def cancel():
            client = APIClient()
            client.force_authenticate(user=self.users[0])
            return client.delete(reverse("registration-cancel", kwargs={"pk": registration.pk})).status_code

        self.assertEqual(self.run_concurrently(edit_event, cancel), [200, 200])
        self.event.refresh_from_db()
        self.assertEqual(self.event.title, "Edited title")
        self.assertEqual((self.event.total_seats, self.event.available_seats), (4, 4))

    def test_concurrent_deactivation_preserves_successful_registration(self):
        def deactivate():
            client = APIClient()
            client.force_authenticate(user=self.organizer)
            return client.delete(reverse("event-detail", kwargs={"pk": self.event.pk})).status_code

        response, deleted = self.run_concurrently(lambda: self.register(self.users[0]), deactivate)
        self.assertEqual(deleted, 204)
        self.assertIn(response, (201, 400))
        self.event.refresh_from_db()
        self.assertFalse(self.event.is_active)
        self.assertEqual(self.event.registrations.count(), int(response == 201))
        self.assertEqual(self.event.available_seats, 1 - self.event.registrations.count())
