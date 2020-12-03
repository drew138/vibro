from rest_framework.permissions import BasePermission, SAFE_METHODS
import jwt


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
    Allow only PATCH methods.
    """

    def has_permission(self, request, view):
        return request.method == "PUT"


class HasUserPermissions(BasePermission):

    """
    Allow only GET methods.
    """

    def has_permission(self, request, view):
        is_authenticated = request.user.is_authenticated
        is_superuser = request.user.is_superuser
        can_update = request.method in {"PUT", "GET"}
        has_permission = is_superuser or can_update
        return is_authenticated and has_permission


class CanGenerateReport(BasePermission):

    """
    allow access to Report endpoint.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.method == 'GET') and request.user.is_active


# TODO  finsih permission and create unit test
class IsArduinoNode(BasePermission):

    "Identify Requests from Arduino"

    def has_permission(self, request, view):
        return request.method == "POST" and self.get_arduino(request)

    @staticmethod
    def get_arduino(request):
        """
        decode jwt to authorize
        """
        import os
        token = request.META.get('HTTP_AUTHORIZATION', '')
        payload = jwt.decode(token, os.getenv(
            'ARDUINO_KEY'), algorithms=['HS256'])
        return "arduino_reference" in payload
