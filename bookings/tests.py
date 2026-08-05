from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from events.models import Event
from bookings.models import EventRegistration

User = get_user_model()


class EventRegistrationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="attendee@example.com",
            password="Password123!",
        )
        self.organizer = User.objects.create_user(
            email="organizer@example.com",
            password="Password123!",
            role=User.Role.ORGANIZER,
        )
        self.event = Event.objects.create(
            title="Concert A",
            description="Description A",
            date=timezone.now() + timezone.timedelta(days=10),
            location="Kyiv",
            price="50.00",
            total_seats=2,
            available_seats=2,
            organizer=self.organizer,
        )
        self.url = reverse("registration-create")
        self.participant_url = reverse(
            "registration-participants", kwargs={"event_id": self.event.id}
        )

    def test_register_for_event_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {"event_id": self.event.id})

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(EventRegistration.objects.count(), 1)
        self.event.refresh_from_db()
        self.assertEqual(self.event.available_seats, 1)
        self.assertEqual(response.data["registration"]["event"], self.event.id)
        self.assertEqual(response.data["message"], "Registration successful.")

    def test_user_appears_in_participant_list(self):
        self.client.force_authenticate(user=self.user)
        self.client.post(self.url, {"event_id": self.event.id})

        response = self.client.get(self.participant_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["user"]["email"], self.user.email)

    def test_cannot_register_duplicate(self):
        self.client.force_authenticate(user=self.user)
        self.client.post(self.url, {"event_id": self.event.id})
        response = self.client.post(self.url, {"event_id": self.event.id})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("You are already registered", str(response.data))

    def test_cannot_register_when_event_is_full(self):
        self.event.available_seats = 0
        self.event.save()
        self.client.force_authenticate(user=self.user)

        response = self.client.post(self.url, {"event_id": self.event.id})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Event is fully booked", str(response.data))
