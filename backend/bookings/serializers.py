from django.db import IntegrityError, models
from rest_framework import serializers
from django.db import transaction

from events.models import Event
from .models import EventRegistration


class EventRegistrationSerializer(serializers.ModelSerializer):
    event_id = serializers.PrimaryKeyRelatedField(
        queryset=Event.objects.filter(is_active=True),
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

        if event.available_seats <= 0:
            raise serializers.ValidationError("Event is fully booked.")

        if EventRegistration.objects.filter(event=event, user=user).exists():
            raise serializers.ValidationError(
                "You are already registered for this event."
            )

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user
        event = validated_data["event"]

        if event.available_seats <= 0:
            raise serializers.ValidationError("Event is fully booked.")

        try:
            registration = EventRegistration.objects.create(**validated_data)
        except IntegrityError:
            raise serializers.ValidationError(
                "You are already registered for this event."
            )
        with transaction.atomic():
            event.available_seats = models.F("available_seats") - 1
            event.save()

        return registration
