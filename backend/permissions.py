from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsStaffOrSuperUser(BasePermission):

    """
    Custom permission to allow readonly requests to non superuser or staff users.
    """

    def has_permission(self, request, view):
        return (request.user.is_staff or request.user.is_superuser) or ((request.method in SAFE_METHODS) and (request.user.is_authenticated))


class UpdatePass(BasePermission):

    """
    Allow only PATCH methods.
    """

    def has_permission(self, request, view):
        return request.method == "PATCH"


class ReportPermissions(BasePermission):

    """
    allow access to Report endpoint.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.method == 'GET') and request.user.is_active
