from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CustomTokenObtainPairView,
    LogoutView,
    MyOrganizerRoleRequestsView,
    OrganizerRoleRequestDecisionView,
    OrganizerRoleRequestListCreateView,
    ProfileView,
    RegisterView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", LogoutView.as_view(), name="token_blacklist"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path(
        "organizer-requests/",
        OrganizerRoleRequestListCreateView.as_view(),
        name="organizer-role-request-list",
    ),
    path(
        "organizer-requests/mine/",
        MyOrganizerRoleRequestsView.as_view(),
        name="my-organizer-role-requests",
    ),
    path(
        "organizer-requests/<int:pk>/<str:decision>/",
        OrganizerRoleRequestDecisionView.as_view(),
        name="organizer-role-request-decision",
    ),
]
