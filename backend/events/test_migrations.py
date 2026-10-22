from django.db import connection
from django.db.migrations.executor import MigrationExecutor
from django.test import TransactionTestCase
from django.utils import timezone


class EventDataMigrationTests(TransactionTestCase):
    def test_legacy_dates_and_seats_are_reconciled_without_losing_bookings(self):
        executor = MigrationExecutor(connection)
        latest = executor.loader.graph.leaf_nodes()
        old_target = [
            ("events", "0004_event_ends_at_event_host_event_starts_at_and_more"),
            ("bookings", "0001_initial"),
        ]
        try:
            executor.migrate(old_target)
            old_apps = executor.loader.project_state(old_target).apps
            User = old_apps.get_model("accounts", "User")
            Event = old_apps.get_model("events", "Event")
            Registration = old_apps.get_model("bookings", "EventRegistration")
            organizer = User.objects.create(email="migration-organizer@example.com", password="!")
            attendee = User.objects.create(email="migration-attendee@example.com", password="!")
            other = User.objects.create(email="migration-other@example.com", password="!")
            now = timezone.now()
            base = {
                "organizer_id": organizer.pk, "description": "Legacy event", "price": "5.00",
                "total_seats": 1, "available_seats": 99, "location": "online",
            }
            legacy = Event.objects.create(**base, title="Legacy date", date=now)
            existing = Event.objects.create(
                **base, title="Existing start", date=now, starts_at=now + timezone.timedelta(days=1)
            )
            undated = Event.objects.create(**base, title="Undated event")
            Registration.objects.create(event_id=legacy.pk, user_id=attendee.pk)
            Registration.objects.create(event_id=legacy.pk, user_id=other.pk)

            executor = MigrationExecutor(connection)
            executor.migrate(latest)
            apps = executor.loader.project_state(latest).apps
            Event = apps.get_model("events", "Event")
            Registration = apps.get_model("bookings", "EventRegistration")
            migrated = Event.objects.get(pk=legacy.pk)
            self.assertEqual(migrated.starts_at, now)
            self.assertEqual((migrated.total_seats, migrated.available_seats), (2, 0))
            self.assertEqual(Registration.objects.filter(event_id=legacy.pk).count(), 2)
            self.assertEqual(Event.objects.get(pk=existing.pk).starts_at, existing.starts_at)
            migrated_undated = Event.objects.get(pk=undated.pk)
            self.assertEqual(migrated_undated.starts_at, undated.created_at)
            self.assertFalse(migrated_undated.is_active)
        finally:
            MigrationExecutor(connection).migrate(latest)
