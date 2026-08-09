from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from events.models import Event, Category

User = get_user_model()


class Command(BaseCommand):
    help = "Seeds the database with initial categories and events for testing."

    def handle(self, *args, **options):
        self.stdout.write("Seeding data...")

        organizer, _ = User.objects.get_or_create(
            email="admin@example.com",
            defaults={"username": "admin", "is_staff": True, "is_superuser": True},
        )

        categories_data = [
            {"name": "Rock & Metal", "slug": "rock-metal"},
            {"name": "Pop & Electronic", "slug": "pop-electronic"},
            {"name": "Classical & Jazz", "slug": "classical-jazz"},
            {"name": "Theater & Shows", "slug": "theater-shows"},
        ]

        categories = {}
        for cat in categories_data:
            category_obj, _ = Category.objects.get_or_create(
                slug=cat["slug"], defaults={"name": cat["name"]}
            )
            categories[cat["slug"]] = category_obj

        now = timezone.now()

        events_data = [
            {
                "title": "Kyiv Rock Festival 2026",
                "description": "The biggest rock and heavy metal festival in Ukraine with live bands.",
                "date": now + timedelta(days=10),
                "location": "Kyiv, VDNG",
                "category": categories["rock-metal"],
                "price": 1200.00,
                "total_seats": 5000,
                "available_seats": 1200,
            },
            {
                "title": "Odesa Jazz Night",
                "description": "Cozy jazz evening near the Black Sea featuring international saxophone artists.",
                "date": now + timedelta(days=2),
                "location": "Odesa, Philharmonic Hall",
                "category": categories["classical-jazz"],
                "price": 600.00,
                "total_seats": 300,
                "available_seats": 50,
            },
            {
                "title": "Electronic Open Air Party",
                "description": "All night techno and electronic dance music with top DJs.",
                "date": now + timedelta(days=30),
                "location": "Lviv, Arena",
                "category": categories["pop-electronic"],
                "price": 850.00,
                "total_seats": 2000,
                "available_seats": 1800,
            },
            {
                "title": "Classical Symphony Orchestra",
                "description": "Beethoven and Mozart masterpieces performed by the national orchestra.",
                "date": now + timedelta(days=5),
                "location": "Kyiv, Opera House",
                "category": categories["classical-jazz"],
                "price": 450.00,
                "total_seats": 800,
                "available_seats": 200,
            },
            {
                "title": "Stand-up Comedy Show",
                "description": "Night of laughter, jokes and fun with Ukraine's best comedians.",
                "date": now + timedelta(days=15),
                "location": "Dnipro, Concert Hall",
                "category": categories["theater-shows"],
                "price": 350.00,
                "total_seats": 400,
                "available_seats": 10,
            },
        ]

        created_count = 0
        for event_kwargs in events_data:
            _, created = Event.objects.get_or_create(
                title=event_kwargs["title"],
                defaults={**event_kwargs, "organizer": organizer},
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully seeded {len(categories)} categories and {created_count} events!"
            )
        )
