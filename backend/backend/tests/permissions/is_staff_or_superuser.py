from backend import permissions as custom_permissions
from django.contrib.auth.models import AnonymousUser
from django.test import TestCase, RequestFactory
from model_bakery import baker


class TestIsStaffOrSuperUser(TestCase):

    def setUp(self):
        self.user = baker.make("backend.VibroUser")
        self.user.is_superuser = True
        self.user.is_staff = True
        self.factory = RequestFactory()
        self.permission_class = custom_permissions.CanReadOrIsStaffOrSuperUser()

    def test_admin_put_requests_return_false(self):
        """
        asserts admins always have permission 
        for non put requests
        """

        self.user.is_staff = False
        request = self.factory.put("/")
        request.user = self.user

        permission = self.permission_class.has_permission(request, None)
        self.assertFalse(permission)

    def test_staff_put_requests_return_false(self):
        """
        asserts admins always have permission 
        for non put requests
        """

        self.user.is_superuser = False
        request = self.factory.put("/")
        request.user = self.user
        permission = self.permission_class.has_permission(request, None)
        self.assertFalse(permission)

    def test_admin_user_returns_true(self):
        """
        asserts admins always have permission 
        for non put requests
        """

        self.user.is_staff = False
        request = self.factory.delete("/")
        request.user = self.user
        permission = self.permission_class.has_permission(request, None)
        self.assertTrue(permission)

    def test_staff_user_returns_true(self):
        """
        asserts staff users always have permission
        for non put requests
        """

        self.user.is_superuser = False
        request = self.factory.delete("/")
        request.user = self.user
        permission = self.permission_class.has_permission(request, None)
        self.assertTrue(permission)

    def test_user_returns_true(self):
        """
        asserts users have permission on safe methods
        """

        self.user.is_superuser = False
        self.user.is_staff = False
        request = self.factory.get("/")
        request.user = self.user
        permission = self.permission_class.has_permission(request, None)
        self.assertTrue(permission)

    def test_user_returns_false(self):
        """
        asserts users don't have permission on unsafe methods
        """

        self.user.is_superuser = False
        self.user.is_staff = False
        request = self.factory.delete("/")
        request.user = self.user
        permission = self.permission_class.has_permission(request, None)
        self.assertFalse(permission)

    def test_no_user_returns_false(self):
        """
        asserts non-authenticated users don't have permissions
        """

        request = self.factory.get("/")
        request.user = AnonymousUser()
        permission = self.permission_class.has_permission(request, None)
        self.assertFalse(permission)
