from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from events.models import Event

User = get_user_model()


class EventListTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="organizer@example.com",
            password="Password123!",
        )

        self.event1 = Event.objects.create(
            title="Concert A",
            description="Description A",
            date="2026-08-01T19:00:00Z",
            location="Kyiv",
            price="50.00",
            total_seats=100,
            available_seats=100,
            organizer=self.user,
        )
        self.event2 = Event.objects.create(
            title="Concert B",
            description="Description B",
            date="2026-08-02T19:00:00Z",
            location="Odesa",
            price="30.00",
            total_seats=50,
            available_seats=50,
            organizer=self.user,
        )
        self.url = reverse("event-list")

    def test_get_events_list_success(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_events_pagination_structure(self):
        response = self.client.get(self.url)
        self.assertIn("count", response.data)
        self.assertIn("results", response.data)
        self.assertEqual(response.data["count"], 2)
        self.assertEqual(len(response.data["results"]), 2)
