import django_filters
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from events.models import Event, Category
from events.permissions import IsOrganizerOrAdminOrReadOnly
from events.serializers import EventSerializer, CategorySerializer


class EventFilter(django_filters.FilterSet):
    category = django_filters.ModelChoiceFilter(
        queryset=Category.objects.all(),
        to_field_name="slug",
    )
    category_id = django_filters.NumberFilter(field_name="category_id")

    class Meta:
        model = Event
        fields = ["category", "category_id", "is_active", "location"]


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsOrganizerOrAdminOrReadOnly]


class EventListCreateView(generics.ListCreateAPIView):
    queryset = (
        Event.objects.filter(is_active=True)
        .select_related("organizer", "category")
        .order_by("-created_at")
    )
    serializer_class = EventSerializer
    permission_classes = [IsOrganizerOrAdminOrReadOnly]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = EventFilter

    search_fields = ["title", "description"]

    ordering_fields = ["date", "title", "created_at", "price"]
    ordering = ["date"]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)


class MyEventsListView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsOrganizerOrAdminOrReadOnly]

    def get_queryset(self):
        return (
            Event.objects.filter(organizer=self.request.user)
            .select_related("category")
            .order_by("-created_at")
        )
