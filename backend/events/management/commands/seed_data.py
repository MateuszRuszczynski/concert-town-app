from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from events.models import Category, Event

User = get_user_model()


class Command(BaseCommand):
    help = "Seeds the database with initial categories and events for testing."

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write("Seeding data...")

        organizer, created = User.objects.update_or_create(
            email="admin@example.com",
            defaults={
                "first_name": "Concert",
                "last_name": "Town",
                "role": User.Role.ADMIN,
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if created:
            organizer.set_unusable_password()
            organizer.save(update_fields=["password"])

        categories_data = [
            {"name": "Conference", "slug": "conference"},
            {"name": "Workshop", "slug": "workshop"},
            {"name": "Music", "slug": "music"},
            {"name": "Networking", "slug": "networking"},
            {"name": "Webinar", "slug": "webinar"},
            {"name": "Social", "slug": "social"},
        ]

        categories = {}
        for category_data in categories_data:
            category, _ = Category.objects.update_or_create(
                slug=category_data["slug"],
                defaults={"name": category_data["name"]},
            )
            categories[category_data["slug"]] = category

        now = timezone.now()
        events_data = [
            {
                "title": "Kyiv Rock Festival 2026",
                "description": (
                    "A large open-air rock festival featuring Ukrainian and "
                    "international bands."
                ),
                "starts_at": now + timedelta(days=10, hours=2),
                "ends_at": now + timedelta(days=10, hours=10),
                "host": "Concert Town Live",
                "location": {"city": "Kyiv", "venue": "VDNG"},
                "category": categories["music"],
                "price": Decimal("1200.00"),
                "total_seats": 5000,
                "available_seats": 1200,
                "is_active": True,
            },
            {
                "title": "Odesa Jazz Night",
                "description": (
                    "An evening of contemporary jazz near the Black Sea with "
                    "international artists."
                ),
                "starts_at": now + timedelta(days=12, hours=1),
                "ends_at": now + timedelta(days=12, hours=5),
                "host": "Black Sea Jazz Club",
                "location": {"city": "Odesa", "venue": "Philharmonic Hall"},
                "category": categories["music"],
                "price": Decimal("600.00"),
                "total_seats": 300,
                "available_seats": 50,
                "is_active": True,
            },
            {
                "title": "Electronic Open Air Party",
                "description": (
                    "An all-night electronic music event with local and European DJs."
                ),
                "starts_at": now + timedelta(days=30, hours=3),
                "ends_at": now + timedelta(days=30, hours=12),
                "host": "Lviv Night Collective",
                "location": {"city": "Lviv", "venue": "Arena Lviv"},
                "category": categories["music"],
                "price": Decimal("850.00"),
                "total_seats": 2000,
                "available_seats": 1800,
                "is_active": True,
            },
            {
                "title": "Classical Symphony Orchestra",
                "description": (
                    "A programme of Beethoven and Mozart performed by the "
                    "national orchestra."
                ),
                "starts_at": now + timedelta(days=18, hours=2),
                "ends_at": now + timedelta(days=18, hours=5),
                "host": "National Philharmonic of Ukraine",
                "location": {"city": "Kyiv", "venue": "National Opera House"},
                "category": categories["music"],
                "price": Decimal("450.00"),
                "total_seats": 800,
                "available_seats": 200,
                "is_active": True,
            },
            {
                "title": "Stand-up Comedy Show",
                "description": (
                    "A relaxed evening featuring established comedians and "
                    "new local talent."
                ),
                "starts_at": now + timedelta(days=15, hours=1),
                "ends_at": now + timedelta(days=15, hours=4),
                "host": "Dnipro Comedy Club",
                "location": {"city": "Dnipro", "venue": "Most City Hall"},
                "category": categories["social"],
                "price": Decimal("350.00"),
                "total_seats": 400,
                "available_seats": 10,
                "is_active": True,
            },
            {
                "title": "Frontend Summit 2026",
                "description": (
                    "A conference about modern frontend architecture, accessibility "
                    "and performance."
                ),
                "starts_at": now + timedelta(days=21, hours=2),
                "ends_at": now + timedelta(days=21, hours=11),
                "host": "Convene Studio",
                "location": {"city": "Kyiv", "venue": "Parkovy Convention Center"},
                "category": categories["conference"],
                "price": Decimal("999.00"),
                "total_seats": 800,
                "available_seats": 158,
                "is_active": True,
            },
            {
                "title": "Design Systems Workshop",
                "description": (
                    "A practical workshop on design tokens, reusable components "
                    "and team workflows."
                ),
                "starts_at": now + timedelta(days=25, hours=4),
                "ends_at": now + timedelta(days=25, hours=8),
                "host": "Convene Studio",
                "location": {"city": "Lviv", "venue": "Tech Hub"},
                "category": categories["workshop"],
                "price": Decimal("499.00"),
                "total_seats": 40,
                "available_seats": 12,
                "is_active": True,
            },
            {
                "title": "Founders and Funders Mixer",
                "description": (
                    "A networking evening for startup founders, investors and "
                    "product leaders."
                ),
                "starts_at": now + timedelta(days=35, hours=1),
                "ends_at": now + timedelta(days=35, hours=4),
                "host": "Startup Ukraine",
                "location": {"city": "Kyiv", "venue": "Unit City"},
                "category": categories["networking"],
                "price": Decimal("0.00"),
                "total_seats": 120,
                "available_seats": 92,
                "is_active": True,
            },
            {
                "title": "Building Accessible React Applications",
                "description": (
                    "A live webinar about accessible components, keyboard navigation "
                    "and testing."
                ),
                "starts_at": now + timedelta(days=8, hours=2),
                "ends_at": now + timedelta(days=8, hours=4),
                "host": "Convene Studio",
                "location": "online",
                "category": categories["webinar"],
                "price": Decimal("0.00"),
                "total_seats": 1000,
                "available_seats": 640,
                "is_active": True,
            },
            {
                "title": "Scaling Django in Production",
                "description": (
                    "An online session about caching, background jobs, observability "
                    "and deployment."
                ),
                "starts_at": now - timedelta(days=30, hours=2),
                "ends_at": now - timedelta(days=30),
                "host": "Convene Studio",
                "location": "online",
                "category": categories["webinar"],
                "price": Decimal("0.00"),
                "total_seats": 1000,
                "available_seats": 426,
                "is_active": False,
            },
            {
                "title": "Community Rooftop Social",
                "description": (
                    "An informal community meetup for people working in technology "
                    "and design."
                ),
                "starts_at": now - timedelta(days=14, hours=4),
                "ends_at": now - timedelta(days=14, hours=1),
                "host": "Concert Town Community",
                "location": {"city": "Kyiv", "venue": "Kooperativ Rooftop"},
                "category": categories["social"],
                "price": Decimal("0.00"),
                "total_seats": 90,
                "available_seats": 45,
                "is_active": False,
            },
        ]

        created_count = 0
        updated_count = 0
        for event_data in events_data:
            starts_at = event_data["starts_at"]
            _, event_created = Event.objects.update_or_create(
                title=event_data["title"],
                organizer=organizer,
                defaults={**event_data, "date": starts_at},
            )
            if event_created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {len(categories)} categories and {len(events_data)} events "
                f"({created_count} created, {updated_count} updated)."
            )
        )
