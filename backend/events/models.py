from django.conf import settings
from django.db import models

from .validators import validate_event_image


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField(null=True, blank=True)
    host = models.CharField(max_length=255, blank=True, default="")
    location = models.JSONField(default=dict, blank=True)

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="events",
    )

    price = models.DecimalField(max_digits=10, decimal_places=2)
    total_seats = models.PositiveIntegerField()
    available_seats = models.PositiveIntegerField()

    image = models.ImageField(
        upload_to="events/", blank=True, null=True, validators=[validate_event_image]
    )

    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="events",
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.starts_at.strftime('%Y-%m-%d %H:%M')})"

    class Meta:
        verbose_name = "Event"
        verbose_name_plural = "Events"
        ordering = ["starts_at", "id"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(total_seats__gt=0), name="event_positive_capacity"
            ),
            models.CheckConstraint(
                condition=models.Q(available_seats__lte=models.F("total_seats")),
                name="event_available_seats_within_capacity",
            ),
        ]
