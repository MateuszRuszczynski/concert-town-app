from rest_framework.permissions import BasePermission


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


class IsAdminRoleOrStaff(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and is_admin(user))
