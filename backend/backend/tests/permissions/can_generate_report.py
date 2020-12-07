from backend import permissions as custom_permissions
from django.contrib.auth.models import AnonymousUser
from django.test import TestCase, RequestFactory
from model_bakery import baker


class TestCanGenerateReport(TestCase):

    def setUp(self):
        self.user = baker.make("backend.VibroUser")
        self.user.is_active = True
        self.factory = RequestFactory()
        self.permission_class = custom_permissions.CanGenerateReport()

    def test_user_returns_true(self):
        """
        asserts authenticated active user using 
        a safe method has permission.
        """

        request = self.factory.get("/")
        request.user = self.user
        permission = self.permission_class.has_permission(request, None)
        self.assertTrue(permission)

    def test_no_user_returns_false(self):
        """
        asserts non-authenticated users don't 
        have permission.
        """

        request = self.factory.get("/")
        request.user = AnonymousUser()
        permission = self.permission_class.has_permission(request, None)
        self.assertFalse(permission)

    def test_unsafe_method_returns_false(self):
        """
        asserts unsafe methods are not permitted.
        """

        request = self.factory.delete("/")
        request.user = self.user
        permission = self.permission_class.has_permission(request, None)
        self.assertFalse(permission)

    def test_inactive_user_returns_false(self):
        """
        asserts inactive users are not permitted.
        """

        self.user.is_active = False
        request = self.factory.delete("/")
        request.user = self.user
        permission = self.permission_class.has_permission(request, None)
        self.assertFalse(permission)
