from rest_framework import permissions


class IsOrganizerOrAdminOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        if not (request.user and request.user.is_authenticated):
            return False

        user_role = getattr(request.user, "role", None)

        if hasattr(user_role, "value"):
            user_role = user_role.value

        is_staff_or_superuser = getattr(
            request.user, "is_staff", False
        ) or getattr(request.user, "is_superuser", False)

        return user_role in ["organizer", "admin"] or is_staff_or_superuser
