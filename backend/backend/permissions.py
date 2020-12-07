from rest_framework.permissions import BasePermission, SAFE_METHODS


class CanReadOrIsStaffOrSuperUser(BasePermission):

    """
    Custom permission to allow readonly requests 
    to non superuser or staff users, or access to non 
    put requests to authorized users.
    """

    def has_permission(self, request, view):
        staff_permissions = (
            request.user.is_staff or request.user.is_superuser) and request.method != "PUT"
        customer_permissions = (request.method in SAFE_METHODS) and (
            request.user.is_authenticated)
        return staff_permissions or customer_permissions


class IsSuperUser(BasePermission):

    """
    only allow access to superusers.
    """

    def has_permission(self, request, view):
        return request.user.is_superuser


class IsUpdateMethod(BasePermission):

    """
    Allow only PUT methods.
    """

    def has_permission(self, request, view):
        return request.method == "PUT"


class HasUserPermissions(BasePermission):

    """
    Allow only GET and Patch methods.
    """

    def has_permission(self, request, view):
        is_authenticated = request.user.is_authenticated
        allowed_methdods = request.method in {"PATCH", "GET"}
        return is_authenticated and allowed_methdods


class CanGenerateReport(BasePermission):

    """
    allow access to Report endpoint.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.method == 'GET') and request.user.is_active
