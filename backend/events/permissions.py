from rest_framework import permissions


def get_normalized_role(user):
    role = getattr(user, "role", "")
    if hasattr(role, "value"):
        role = role.value
    return str(role).strip().lower()


def is_admin(user):
    return (
        get_normalized_role(user) == "admin"
        or getattr(user, "is_staff", False)
        or getattr(user, "is_superuser", False)
    )


def can_manage_events(user):
    if not (user and user.is_authenticated):
        return False
    return get_normalized_role(user) in ["organizer", "admin"] or is_admin(user)


class IsOrganizerOrAdminOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return can_manage_events(request.user)

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            if obj.is_active:
                return True

            if not (request.user and request.user.is_authenticated):
                return False

            return is_admin(request.user) or obj.organizer == request.user

        if not (request.user and request.user.is_authenticated):
            return False

        if is_admin(request.user):
            return True

        return obj.organizer == request.user


class IsOrganizerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return can_manage_events(request.user)
