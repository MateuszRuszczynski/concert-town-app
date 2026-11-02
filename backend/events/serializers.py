from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from .models import Category, Event


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class OfflineLocationSerializer(serializers.Serializer):
    city = serializers.CharField(max_length=100)
    venue = serializers.CharField(max_length=255)

    def to_internal_value(self, data):
        errors = {
            field: ["Must be a string."]
            for field in self.fields
            if field in data and not isinstance(data[field], str)
        }
        if errors:
            raise serializers.ValidationError(errors)
        return super().to_internal_value(data)


class EventLocationField(serializers.JSONField):
    def to_internal_value(self, data):
        value = super().to_internal_value(data)
        if value == "online":
            return value
        if not isinstance(value, dict):
            raise serializers.ValidationError(
                "Location must be 'online' or an object with city and venue."
            )
        location = OfflineLocationSerializer(data=value)
        location.is_valid(raise_exception=True)
        return location.validated_data


class EventListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    organizer_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "starts_at",
            "ends_at",
            "host",
            "location",
            "category",
            "price",
            "total_seats",
            "available_seats",
            "image",
            "organizer_id",
            "is_active",
        ]
        read_only_fields = ["id", "organizer_id", "available_seats"]


class EventDetailSerializer(EventListSerializer):
    class Meta(EventListSerializer.Meta):
        fields = EventListSerializer.Meta.fields + ["created_at", "updated_at"]
        read_only_fields = EventListSerializer.Meta.read_only_fields + [
            "created_at",
            "updated_at",
        ]


class EventSerializer(EventDetailSerializer):
    location = EventLocationField()
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta(EventDetailSerializer.Meta):
        fields = EventDetailSerializer.Meta.fields + ["category_id"]

    def validate_future_time(self, field, value):
        previous = getattr(self.instance, field, None)
        unchanged = (
            value is not None
            and previous is not None
            and value.replace(microsecond=0) == previous.replace(microsecond=0)
        )
        if value is not None and not unchanged and value <= timezone.now():
            raise serializers.ValidationError("Event time must be in the future.")
        return value

    def validate_starts_at(self, value):
        return self.validate_future_time("starts_at", value)

    def validate_ends_at(self, value):
        return self.validate_future_time("ends_at", value)

    def validate(self, attrs):
        starts_at = attrs.get("starts_at", getattr(self.instance, "starts_at", None))
        ends_at = attrs.get("ends_at", getattr(self.instance, "ends_at", None))
        if starts_at and ends_at and ends_at <= starts_at:
            raise serializers.ValidationError(
                {"ends_at": "End time must be after the start time."}
            )
        return attrs

    def create(self, validated_data):
        validated_data["available_seats"] = validated_data["total_seats"]
        return super().create(validated_data)

    def update(self, instance, validated_data):
        with transaction.atomic():
            instance = Event.objects.select_for_update().get(pk=instance.pk)
            capacity = validated_data.get("total_seats", instance.total_seats)
            registered_count = instance.registrations.count()
            if capacity < registered_count:
                raise serializers.ValidationError(
                    {
                        "total_seats": (
                            "Capacity cannot be less than the number of registrations."
                        )
                    }
                )
            validated_data["available_seats"] = capacity - registered_count
            return super().update(instance, validated_data)

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value

    def validate_total_seats(self, value):
        if value <= 0:
            raise serializers.ValidationError("Total seats must be greater than zero.")
        return value
