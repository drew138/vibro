from rest_framework.permissions import BasePermission, SAFE_METHODS
from .user_groups import (
    STAFF,
    ADMIN,
    CLIENT
)


class GeneralPermission(BasePermission):

    """
    Permission to allow readonly requests 
    to non client users, or access to non 
    put requests to staff users.
    """

    def has_permission(self, request, view):
        is_authenticated = request.user.is_authenticated
        staff_permissions = (
            request.user.user_type in STAFF) and request.method != "PUT"
        client_permissions = (
            request.user.user_type in CLIENT) and (request.method in SAFE_METHODS)
        return is_authenticated and (staff_permissions or client_permissions)


class IsAdmin(BasePermission):

    """
    allow access to admins only.
    """

    def has_permission(self, request, view):
        return request.user.user_type in ADMIN


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


class IsGetRequest(BasePermission):

    """
    allow access to Report endpoint.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.method == 'GET') and request.user.is_active
