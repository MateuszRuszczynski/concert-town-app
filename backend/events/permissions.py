from rest_framework import permissions

from accounts.permissions import get_normalized_role, is_admin


def can_manage_event(user, event):
    return bool(
        user
        and user.is_authenticated
        and (is_admin(user) or event.organizer == user)
    )


def can_manage_events(user):
    if not (user and user.is_authenticated):
        return False
    return get_normalized_role(user) == "organizer" or is_admin(user)


class IsOrganizerOrAdminOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return can_manage_events(request.user)

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            if obj.is_active:
                return True

            return can_manage_event(request.user, obj) or bool(
                request.user.is_authenticated
                and obj.registrations.filter(user=request.user).exists()
            )

        return can_manage_event(request.user, obj)


class IsOrganizerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return can_manage_events(request.user)
