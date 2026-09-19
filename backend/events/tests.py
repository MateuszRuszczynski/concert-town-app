from io import StringIO

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.management import call_command
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from events.models import Category, Event

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

    def test_filter_events_by_organizer(self):
        other_user = User.objects.create_user(
            email="other-organizer@example.com",
            password="Password123!",
        )
        Event.objects.create(
            title="Concert C",
            description="Description C",
            date="2026-08-03T19:00:00Z",
            location="Lviv",
            price="40.00",
            total_seats=75,
            available_seats=75,
            organizer=other_user,
        )

        response = self.client.get(self.url, {"organizer": other_user.id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["title"], "Concert C")


class EventCreationPermissionTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.organizer = User.objects.create_user(
            email="event-creator@example.com",
            password="Password123!",
            role=User.Role.ORGANIZER,
        )
        self.event_data = {
            "title": "JWT organizer event",
            "description": "Created with an organizer access token.",
            "starts_at": timezone.now() + timezone.timedelta(days=10),
            "ends_at": timezone.now() + timezone.timedelta(days=10, hours=2),
            "host": "JWT Organizer",
            "location": {"city": "Kyiv", "venue": "Test Hall"},
            "price": "100.00",
            "total_seats": 100,
            "available_seats": 100,
        }

    def test_organizer_can_create_event_with_jwt_access_token(self):
        login_response = self.client.post(
            reverse("token_obtain_pair"),
            {"email": self.organizer.email, "password": "Password123!"},
            format="json",
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}"
        )
        access_token = AccessToken(login_response.data["access"])

        response = self.client.post(
            reverse("event-list"), self.event_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["organizer"], self.organizer.id)
        self.assertEqual(access_token["role"], User.Role.ORGANIZER)

    def test_legacy_organizer_role_format_is_normalized(self):
        self.organizer.role = " Organizer "
        self.organizer.save(update_fields=["role"])
        login_response = self.client.post(
            reverse("token_obtain_pair"),
            {"email": self.organizer.email, "password": "Password123!"},
            format="json",
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}"
        )

        response = self.client.post(
            reverse("event-list"), self.event_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_customer_cannot_create_event_with_jwt_access_token(self):
        customer = User.objects.create_user(
            email="event-customer@example.com",
            password="Password123!",
        )
        login_response = self.client.post(
            reverse("token_obtain_pair"),
            {"email": customer.email, "password": "Password123!"},
            format="json",
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}"
        )

        response = self.client.post(
            reverse("event-list"), self.event_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class OrganizerEventListTests(APITestCase):
    def setUp(self):
        self.organizer = User.objects.create_user(
            email="organizer-list@example.com",
            password="Password123!",
            role=User.Role.ORGANIZER,
        )
        self.other_organizer = User.objects.create_user(
            email="other-organizer-list@example.com",
            password="Password123!",
            role=User.Role.ORGANIZER,
        )
        self.customer = User.objects.create_user(
            email="customer-list@example.com",
            password="Password123!",
        )
        event_data = {
            "description": "Description",
            "starts_at": timezone.now() + timezone.timedelta(days=10),
            "location": "Kyiv",
            "price": "50.00",
            "total_seats": 100,
            "available_seats": 100,
        }
        self.active_event = Event.objects.create(
            title="Active event",
            organizer=self.organizer,
            is_active=True,
            **event_data,
        )
        self.inactive_event = Event.objects.create(
            title="Inactive event",
            organizer=self.organizer,
            is_active=False,
            **event_data,
        )
        Event.objects.create(
            title="Other organizer event",
            organizer=self.other_organizer,
            is_active=True,
            **event_data,
        )

    def test_organizer_gets_only_own_events(self):
        self.client.force_authenticate(user=self.organizer)

        response = self.client.get(reverse("my-events-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)
        self.assertEqual(
            [event["id"] for event in response.data["results"]],
            [self.active_event.id, self.inactive_event.id],
        )

    def test_active_and_inactive_events_have_separate_endpoints(self):
        self.client.force_authenticate(user=self.organizer)

        active_response = self.client.get(reverse("my-active-events-list"))
        inactive_response = self.client.get(reverse("my-inactive-events-list"))

        self.assertEqual(active_response.status_code, status.HTTP_200_OK)
        self.assertEqual(inactive_response.status_code, status.HTTP_200_OK)
        self.assertEqual(active_response.data["count"], 1)
        self.assertEqual(inactive_response.data["count"], 1)
        self.assertEqual(
            active_response.data["results"][0]["id"], self.active_event.id
        )
        self.assertEqual(
            inactive_response.data["results"][0]["id"], self.inactive_event.id
        )

    def test_organizer_events_can_be_filtered_by_status(self):
        self.client.force_authenticate(user=self.organizer)

        response = self.client.get(reverse("my-events-list"), {"status": "inactive"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["id"], self.inactive_event.id)

    def test_customer_cannot_access_organizer_events(self):
        self.client.force_authenticate(user=self.customer)

        response = self.client.get(reverse("my-events-list"))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_inactive_event_is_visible_only_to_its_organizer(self):
        url = reverse("event-detail", kwargs={"pk": self.inactive_event.id})

        anonymous_response = self.client.get(url)
        self.client.force_authenticate(user=self.other_organizer)
        other_response = self.client.get(url)
        self.client.force_authenticate(user=self.organizer)
        organizer_response = self.client.get(url)

        self.assertEqual(anonymous_response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(other_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(organizer_response.status_code, status.HTTP_200_OK)


class SeedDataTests(APITestCase):
    def test_seed_data_matches_current_event_model(self):
        call_command("seed_data", stdout=StringIO())

        seeded_events = Event.objects.filter(organizer__email="admin@example.com")
        category_slugs = set(Category.objects.values_list("slug", flat=True))
        active_category_slugs = set(
            seeded_events.filter(is_active=True).values_list(
                "category__slug", flat=True
            )
        )
        organizer = User.objects.get(email="admin@example.com")

        self.assertEqual(seeded_events.count(), 11)
        self.assertEqual(seeded_events.filter(is_active=True).count(), 9)
        self.assertEqual(seeded_events.filter(is_active=False).count(), 2)
        self.assertEqual(
            category_slugs,
            {
                "conference",
                "workshop",
                "music",
                "networking",
                "webinar",
                "social",
            },
        )
        self.assertEqual(active_category_slugs, category_slugs)
        self.assertEqual(organizer.role, User.Role.ADMIN)
        self.assertTrue(organizer.is_staff)
        self.assertTrue(organizer.is_superuser)

        for event in seeded_events:
            self.assertIsNotNone(event.starts_at)
            self.assertIsNotNone(event.ends_at)
            self.assertEqual(event.date, event.starts_at)
            self.assertLess(event.starts_at, event.ends_at)
            self.assertTrue(event.host)
            self.assertLessEqual(event.available_seats, event.total_seats)
            self.assertTrue(
                event.location == "online"
                or {"city", "venue"}.issubset(event.location)
            )

    def test_seed_data_is_idempotent(self):
        call_command("seed_data", stdout=StringIO())
        call_command("seed_data", stdout=StringIO())

        self.assertEqual(
            Event.objects.filter(organizer__email="admin@example.com").count(), 11
        )
        self.assertEqual(Category.objects.count(), 6)
