from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsStaffOrSuperUser(BasePermission):
    
    """
    Custom permission to allow readonly requests to non superuser or staff users.
    """

    def has_permission(self, request, view):
        if (request.user.is_staff or request.user.is_superuser) or (request.method in SAFE_METHODS):
            return True
        return False