from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from events.models import Event
from events.serializers import EventSerializer


class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.order_by("-created_at")
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

