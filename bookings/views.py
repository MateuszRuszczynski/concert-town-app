from django.db import transaction
from django.db.models import F
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import EventRegistration
from .serializers import EventRegistrationSerializer


class EventRegistrationCreateView(generics.CreateAPIView):
    queryset = EventRegistration.objects.all()
    serializer_class = EventRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        registration = serializer.save()
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
        return EventRegistration.objects.filter(
            event_id=self.kwargs["event_id"]
        ).select_related("event", "user")


class EventCancelRegistration(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EventRegistration.objects.filter(
            user=self.request.user
        ).select_related("event", "user")

    def perform_destroy(self, instance):
        event = instance.event
        with transaction.atomic():
            event.available_seats = F("available_seats") + 1
            event.save()
            instance.delete()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"message": "Registration canceled."}, status=status.HTTP_200_OK
        )
