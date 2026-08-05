from django.urls import path

from .views import (
    EventParticipantListView,
    EventRegistrationCreateView,
    UserEventRegistrationListView,
)

urlpatterns = [
    path(
        "register/", EventRegistrationCreateView.as_view(), name="registration-create"
    ),
    path(
        "my-registrations/",
        UserEventRegistrationListView.as_view(),
        name="registration-list",
    ),
    path(
        "event/<int:event_id>/participants/",
        EventParticipantListView.as_view(),
        name="registration-participants",
    ),
]
