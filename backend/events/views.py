import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated

from events.models import Category, Event
from events.permissions import IsOrganizerOrAdminOrReadOnly
from events.serializers import CategorySerializer, EventSerializer

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

    class Meta:
        model = Event
        fields = ["category", "category_id", "is_active", "location"]

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsOrganizerOrAdminOrReadOnly]

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.filter(is_active=True).select_related(
        "organizer", "category"
    )
    serializer_class = EventSerializer
    permission_classes = [IsOrganizerOrAdminOrReadOnly]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    filter_backends = [
        DjangoFilterBackend,
        FlexibleSearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = EventFilter
    search_fields = ["title", "description"]
    ordering_fields = ["date", "title", "created_at", "price"]

    ordering = ["-created_at"]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all().select_related("organizer", "category")
    serializer_class = EventSerializer
    permission_classes = [IsOrganizerOrAdminOrReadOnly]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

class MyEventsListView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Event.objects.none()
        return (
            Event.objects.filter(organizer=self.request.user)
            .select_related("organizer", "category")
            .order_by("-created_at")
        )
