from django.urls import path
from events.views import EventListCreateView
from bookings.views import EventParticipantListView

urlpatterns = [
    path("", EventListCreateView.as_view(), name="event-list"),
    path(
        "event/<int:event_id>/participants/",
        EventParticipantListView.as_view(),
        name="registration-participants",
    ),
]
