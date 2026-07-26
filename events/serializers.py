from django.utils import timezone
from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "date",
            "location",
            "price",
            "total_seats",
            "available_seats",
            "image",
            "organizer",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "organizer", "created_at", "updated_at"]

    def validate_date(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("Event date must be in the future.")
        return value

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value

    def validate_total_seats(self, value):
        if value <= 0:
            raise serializers.ValidationError("Total seats must be greater than zero.")
        return value

    def validate(self, attrs):
        total_seats = attrs.get("total_seats")
        available_seats = attrs.get("available_seats")

        if available_seats is not None and total_seats is not None:
            if available_seats > total_seats:
                raise serializers.ValidationError(
                    {"available_seats": "Available seats cannot exceed total seats."}
                )
            if available_seats < 0:
                raise serializers.ValidationError(
                    {"available_seats": "Available seats cannot be negative."}
                )

        return attrs

    def create(self, validated_data):
        if "request" in self.context and hasattr(self.context["request"], "user"):
            validated_data["organizer"] = self.context["request"].user
        return super().create(validated_data)