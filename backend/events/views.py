import django_filters
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny

from accounts.permissions import IsAdminRoleOrStaff
from events.models import Category, Event
from events.permissions import IsOrganizerOrAdmin, IsOrganizerOrAdminOrReadOnly
from events.serializers import (
    CategorySerializer,
    EventDetailSerializer,
    EventListSerializer,
    EventSerializer,
)


class FlexibleSearchFilter(filters.SearchFilter):
    def get_search_terms(self, request):
        params = request.query_params.get(
            self.search_param
        ) or request.query_params.get("q")
        if params:
            return params.replace(",", " ").split()
        return super().get_search_terms(request)


class EventFilter(django_filters.FilterSet):
    category = django_filters.ModelChoiceFilter(
        queryset=Category.objects.all(),
        to_field_name="slug",
    )
    category_id = django_filters.NumberFilter(field_name="category_id")
    organizer = django_filters.NumberFilter(field_name="organizer_id")
    organizer_id = django_filters.NumberFilter(field_name="organizer_id")

    class Meta:
        model = Event
        fields = ["category", "category_id", "organizer", "organizer_id"]


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.order_by("name", "id")
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAdminRoleOrStaff()]
        return [AllowAny()]


class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.filter(is_active=True).select_related(
        "organizer", "category"
    )
    serializer_class = EventListSerializer
    permission_classes = [IsOrganizerOrAdminOrReadOnly]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    filter_backends = [
        DjangoFilterBackend,
        FlexibleSearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = EventFilter
    search_fields = ["title", "description"]
    ordering_fields = ["starts_at", "title", "created_at", "price"]

    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return EventSerializer
        return EventListSerializer

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all().select_related("organizer", "category")
    serializer_class = EventDetailSerializer
    permission_classes = [IsOrganizerOrAdminOrReadOnly]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return EventSerializer
        return EventDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.method in ("PUT", "PATCH", "DELETE"):
            return queryset.select_for_update(of=("self",))
        return queryset

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save(update_fields=["is_active", "updated_at"])


class MyEventsListView(generics.ListAPIView):
    serializer_class = EventListSerializer
    permission_classes = [IsOrganizerOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["is_active"]
    ordering_fields = ["starts_at", "title", "created_at", "price"]
    ordering = ["-is_active", "-created_at"]
    activity = None

    def get_queryset(self):
        queryset = (
            Event.objects.filter(organizer=self.request.user)
            .select_related("organizer", "category")
        )

        activity = self.activity or self.request.query_params.get("status")
        if activity == "active":
            queryset = queryset.filter(is_active=True)
        elif activity == "inactive":
            queryset = queryset.filter(is_active=False)

        return queryset
