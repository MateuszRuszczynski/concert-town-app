from django.db import migrations
from django.db.models import Count, F


def reconcile_events(apps, schema_editor):
    Event = apps.get_model("events", "Event")
    database = schema_editor.connection.alias
    events = Event.objects.using(database).annotate(registered_count=Count("registrations"))
    for event in events.iterator():
        starts_at = event.starts_at or event.date or event.created_at
        capacity = max(event.total_seats, event.registered_count, 1)
        changes = {
            "starts_at": starts_at,
            "total_seats": capacity,
            "available_seats": capacity - event.registered_count,
        }
        if event.starts_at is None and event.date is None:
            changes["is_active"] = False
        Event.objects.using(database).filter(pk=event.pk).update(**changes)


def restore_legacy_dates(apps, schema_editor):
    Event = apps.get_model("events", "Event")
    Event.objects.using(schema_editor.connection.alias).update(date=F("starts_at"))


class Migration(migrations.Migration):
    dependencies = [
        ("events", "0004_event_ends_at_event_host_event_starts_at_and_more"),
        ("bookings", "0001_initial"),
    ]

    operations = [migrations.RunPython(reconcile_events, restore_legacy_dates)]
