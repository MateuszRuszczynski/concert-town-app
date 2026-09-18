from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from events.models import Event
from .models import EventRegistration


class EventRegistrationSerializer(serializers.ModelSerializer):
    event_id = serializers.PrimaryKeyRelatedField(
        queryset=Event.objects.all(),
        source="event",
        write_only=True,
    )
    event = serializers.PrimaryKeyRelatedField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = EventRegistration
        fields = ["id", "event", "event_id", "user", "registered_at"]
        read_only_fields = ["id", "event", "user", "registered_at"]

    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "email": obj.user.email,
            "first_name": obj.user.first_name,
            "last_name": obj.user.last_name,
        }

    def validate(self, attrs):
        event = attrs["event"]
        user = self.context["request"].user

        self.validate_event_availability(event, user)

        return attrs

    def validate_event_availability(self, event, user):
        if not event.is_active:
            raise serializers.ValidationError("Event is not active.")

        starts_at = event.starts_at or event.date
        if starts_at is not None and starts_at <= timezone.now():
            raise serializers.ValidationError("Event registration is closed.")

        if event.available_seats <= 0:
            raise serializers.ValidationError("Event is fully booked.")

        if event.organizer_id == user.id:
            raise serializers.ValidationError(
                "You cannot register for an event you organize."
            )

        if EventRegistration.objects.filter(event=event, user=user).exists():
            raise serializers.ValidationError(
                "You are already registered for this event."
            )

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user
        event_id = validated_data["event"].id

        with transaction.atomic():
            event = Event.objects.select_for_update().get(id=event_id)
            self.validate_event_availability(event, user)
            validated_data["event"] = event
            registration = EventRegistration.objects.create(**validated_data)
            event.available_seats -= 1
            event.save(update_fields=["available_seats"])

        return registration
