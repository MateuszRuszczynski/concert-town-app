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

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            if obj.is_active:
                return True

            if not (request.user and request.user.is_authenticated):
                return False

            return self.is_admin(request.user) or obj.organizer == request.user

        if not (request.user and request.user.is_authenticated):
            return False

        if self.is_admin(request.user):
            return True

        return obj.organizer == request.user

    @staticmethod
    def is_admin(user):
        role = getattr(user, "role", None)
        if hasattr(role, "value"):
            role = role.value
        return (
            role == "admin"
            or getattr(user, "is_staff", False)
            or getattr(user, "is_superuser", False)
        )


class IsOrganizerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        role = getattr(request.user, "role", None)
        if hasattr(role, "value"):
            role = role.value

        return (
            role in ["organizer", "admin"]
            or getattr(request.user, "is_staff", False)
            or getattr(request.user, "is_superuser", False)
        )
