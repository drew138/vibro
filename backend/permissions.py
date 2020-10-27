from rest_framework.permissions import BasePermission, SAFE_METHODS
import jwt


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
        return request.method == "PUT"


class ReportPermissions(BasePermission):

    """
    allow access to Report endpoint.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.method == 'GET') and request.user.is_active


class ArduinoPermission(BasePermission):

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
