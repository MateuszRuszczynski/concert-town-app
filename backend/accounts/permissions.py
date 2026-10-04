from rest_framework.permissions import BasePermission


class IsAdminRoleOrStaff(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (
                getattr(user, "role", None) == "admin"
                or user.is_staff
                or user.is_superuser
            )
        )
