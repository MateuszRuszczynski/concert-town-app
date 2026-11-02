from django.db import transaction
from django.db.models import F
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from events.models import Event
from events.permissions import can_manage_event
from .models import EventRegistration
from .serializers import EventRegistrationSerializer


class EventRegistrationCreateView(generics.CreateAPIView):
    queryset = EventRegistration.objects.all()
    serializer_class = EventRegistrationSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "booking_create"

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "message": "Registration successful.",
                "registration": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class UserEventRegistrationListView(generics.ListAPIView):
    serializer_class = EventRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EventRegistration.objects.filter(user=self.request.user).select_related(
            "event", "user"
        )


class EventParticipantListView(generics.ListAPIView):
    serializer_class = EventRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        event = get_object_or_404(Event, pk=self.kwargs["event_id"])
        if not can_manage_event(self.request.user, event):
            raise PermissionDenied(
                "You are not authorized to view participants for this event."
            )
        return EventRegistration.objects.filter(event=event).select_related(
            "event", "user"
        )


class EventCancelRegistration(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EventRegistration.objects.all().select_related("event", "user")

    def get_object(self):
        instance = super().get_object()
        if instance.user != self.request.user:
            raise PermissionDenied(
                "You are not authorized to cancel this registration."
            )
        return instance

    def perform_destroy(self, instance):
        with transaction.atomic():
            event = Event.objects.select_for_update().get(pk=instance.event_id)
            registration = get_object_or_404(
                EventRegistration.objects.select_for_update(), pk=instance.pk
            )
            if event.starts_at <= timezone.now():
                raise ValidationError(
                    "Registration cannot be canceled after the event has started."
                )
            registration.delete()
            Event.objects.filter(pk=event.pk).update(
                available_seats=F("available_seats") + 1
            )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"message": "Registration canceled."}, status=status.HTTP_200_OK
        )
