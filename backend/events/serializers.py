from django.utils import timezone
from rest_framework import serializers

from .models import Category, Event


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class EventSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    organizer_id = serializers.IntegerField(source="organizer.id", read_only=True)

    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "date",
            "starts_at",
            "ends_at",
            "host",
            "location",
            "category",
            "category_id",
            "price",
            "total_seats",
            "available_seats",
            "image",
            "organizer",
            "organizer_id",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "organizer", "created_at", "updated_at"]

    def validate_starts_at(self, value):
        if value is not None and value < timezone.now():
            raise serializers.ValidationError("Event start time must be in the future.")
        return value

    def validate_ends_at(self, value):
        if value is not None and value < timezone.now():
            raise serializers.ValidationError("Event end time must be in the future.")
        return value

    def validate(self, attrs):
        starts_at = attrs.get("starts_at", getattr(self.instance, "starts_at", None))
        ends_at = attrs.get("ends_at", getattr(self.instance, "ends_at", None))
        if starts_at and ends_at and ends_at < starts_at:
            raise serializers.ValidationError(
                {"ends_at": "End time must be after the start time."}
            )

        total_seats = attrs.get("total_seats")
        if total_seats is None and self.instance:
            total_seats = self.instance.total_seats

        available_seats = attrs.get("available_seats")
        if available_seats is None and self.instance:
            available_seats = self.instance.available_seats

        if available_seats is not None and total_seats is not None:
            if available_seats > total_seats:
                raise serializers.ValidationError(
                    {"available_seats": "Available seats cannot exceed total seats."}
                )
            if available_seats < 0:
                raise serializers.ValidationError(
                    {"available_seats": "Available seats cannot be negative."}
                )

        location = attrs.get("location")
        if location is not None and not isinstance(location, (str, dict)):
            raise serializers.ValidationError(
                {"location": "Location must be 'online' or an object with city and venue."}
            )

        if isinstance(location, dict):
            if "city" not in location or "venue" not in location:
                raise serializers.ValidationError(
                    {"location": "Location object must include city and venue."}
                )

        return attrs

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value

    def validate_total_seats(self, value):
        if value <= 0:
            raise serializers.ValidationError("Total seats must be greater than zero.")
        return value
