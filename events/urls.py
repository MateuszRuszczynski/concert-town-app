from django.urls import path
from bookings.views import EventParticipantListView
from events.views import (
    CategoryListCreateView,
    EventListCreateView,
    MyEventsListView,
)

urlpatterns = [
    path("categories/", CategoryListCreateView.as_view(), name="category-list"),
    path("", EventListCreateView.as_view(), name="event-list"),
    path("my/", MyEventsListView.as_view(), name="my-events-list"),
    path(
        "event/<int:event_id>/participants/",
        EventParticipantListView.as_view(),
        name="registration-participants",
    ),
]
