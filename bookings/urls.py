from django.urls import path

from .views import (
    EventCancelRegistration,
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
        "cancel/<int:pk>/",
        EventCancelRegistration.as_view(),
        name="registration-cancel",
    ),
]
