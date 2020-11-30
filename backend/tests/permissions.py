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

    def test_admin_user_returns_true(self):
        """
        asserts admins always have permission
        """

        self.user.is_staff = False
        request = self.factory.delete("/")
        request.user = self.user
        permission_class = custom_permissions.IsStaffOrSuperUser()
        permission = permission_class.has_permission(request, None)
        self.assertTrue(permission)

    def test_staff_user_returns_true(self):
        """
        asserts staff users always have permission
        """

        self.user.is_superuser = False
        request = self.factory.delete("/")
        request.user = self.user
        permission_class = custom_permissions.IsStaffOrSuperUser()
        permission = permission_class.has_permission(request, None)
        self.assertTrue(permission)

    def test_user_returns_true(self):
        """
        asserts users have permission on safe methods
        """

        self.user.is_superuser = False
        self.user.is_staff = False
        request = self.factory.get("/")
        request.user = self.user
        permission_class = custom_permissions.IsStaffOrSuperUser()
        permission = permission_class.has_permission(request, None)
        self.assertTrue(permission)

    def test_user_returns_false(self):
        """
        asserts users don't have permission on unsafe methods
        """

        self.user.is_superuser = False
        self.user.is_staff = False
        request = self.factory.delete("/")
        request.user = self.user
        permission_class = custom_permissions.IsStaffOrSuperUser()
        permission = permission_class.has_permission(request, None)
        self.assertFalse(permission)

    def test_no_user_returns_false(self):
        """
        asserts non-authenticated users don't have permissions
        """

        request = self.factory.get("/")
        request.user = AnonymousUser()
        permission_class = custom_permissions.IsStaffOrSuperUser()
        permission = permission_class.has_permission(request, None)
        self.assertFalse(permission)


class TestCanUpdatePass(TestCase):

    def setUp(self):
        self.factory = RequestFactory()

    def test_put_request_returns_true(self):
        """
        asserts put requests return true.
        """

        request = self.factory.put("/")
        permission_class = custom_permissions.CanUpdatePass()
        permission = permission_class.has_permission(request, None)
        self.assertTrue(permission)

    def test_get_request_returns_false(self):
        """
        asserts get requests return false.
        """

        request = self.factory.get("/")
        permission_class = custom_permissions.CanUpdatePass()
        permission = permission_class.has_permission(request, None)
        self.assertFalse(permission)

    def test_delete_request_returns_false(self):
        """
        asserts delete requests return false.
        """

        request = self.factory.delete("/")
        permission_class = custom_permissions.CanUpdatePass()
        permission = permission_class.has_permission(request, None)
        self.assertFalse(permission)

    def test_patch_request_returns_false(self):
        """
        asserts patch requests return false.
        """

        request = self.factory.patch("/")
        permission_class = custom_permissions.CanUpdatePass()
        permission = permission_class.has_permission(request, None)
        self.assertFalse(permission)


class TestCanGenerateReport(TestCase):

    def setUp(self):
        self.user = baker.make("backend.VibroUser")
        self.user.is_active = True
        self.factory = RequestFactory()

    def test_user_returns_true(self):
        """
        asserts authenticated active user using 
        a safe method has permission.
        """

        request = self.factory.get("/")
        request.user = self.user
        permission_class = custom_permissions.CanGenerateReport()
        permission = permission_class.has_permission(request, None)
        self.assertTrue(permission)

    def test_no_user_returns_false(self):
        """
        asserts non-authenticated users don't 
        have permission.
        """

        request = self.factory.get("/")
        request.user = AnonymousUser()
        permission_class = custom_permissions.CanGenerateReport()
        permission = permission_class.has_permission(request, None)
        self.assertFalse(permission)

    def test_unsafe_method_returns_false(self):
        """
        asserts unsafe methods are not permitted.
        """

        request = self.factory.delete("/")
        request.user = self.user
        permission_class = custom_permissions.CanGenerateReport()
        permission = permission_class.has_permission(request, None)
        self.assertFalse(permission)

    def test_inactive_user_returns_false(self):
        """
        asserts inactive users are not permitted.
        """

        self.user.is_active = False
        request = self.factory.delete("/")
        request.user = self.user
        permission_class = custom_permissions.CanGenerateReport()
        permission = permission_class.has_permission(request, None)
        self.assertFalse(permission)
