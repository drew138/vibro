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


class TestIsUpdateMethod(TestCase):

    def setUp(self):
        self.factory = RequestFactory()
        self.permission_class = custom_permissions.IsUpdateMethod()

    def test_put_request_returns_true(self):
        """
        asserts put requests return true.
        """

        request = self.factory.put("/")
        permission = self.permission_class.has_permission(request, None)
        self.assertTrue(permission)

    def test_get_request_returns_false(self):
        """
        asserts get requests return false.
        """

        request = self.factory.get("/")
        permission = self.permission_class.has_permission(request, None)
        self.assertFalse(permission)

    def test_delete_request_returns_false(self):
        """
        asserts delete requests return false.
        """

        request = self.factory.delete("/")
        permission = self.permission_class.has_permission(request, None)
        self.assertFalse(permission)

    def test_patch_request_returns_false(self):
        """
        asserts patch requests return false.
        """

        request = self.factory.patch("/")
        permission = self.permission_class.has_permission(request, None)
        self.assertFalse(permission)


class TestHasUserPermissions(TestCase):

    def setUp(self):
        self.user = baker.make("backend.VibroUser")
        self.factory = RequestFactory()
        self.user.is_superuser = False
        self.permission_class = custom_permissions.HasUserPermissions()

    def test_anonymous_user_returns_false(self):
        """
        asserts anonymous users have no permissions.
        """

        request = self.factory.get('/')
        request.user = AnonymousUser()
        permission = self.permission_class.has_permission(request, None)
        self.assertFalse(permission)

    def test_admin_user_returns_true(self):
        """
        asserts admin users have all permissions.
        """

        request = self.factory.delete('/')
        self.user.is_superuser = True
        request.user = self.user
        permission = self.permission_class.has_permission(request, None)
        self.assertTrue(permission)

    def test_non_admin_user_get_method_returns_true(self):
        """
        asserts non admin users have  
        access to get methods.
        """

        request = self.factory.get('/')
        self.user.is_staff = True
        request.user = self.user
        permission = self.permission_class.has_permission(request, None)
        self.assertTrue(permission)

    def test_non_admin_user_put_method_returns_true(self):
        """
        asserts non admin users have 
        access to put methods.
        """

        request = self.factory.put('/')
        self.user.is_staff = True
        request.user = self.user
        permission = self.permission_class.has_permission(request, None)
        self.assertTrue(permission)

    def test_non_admin_user_patch_method_returns_false(self):
        """
        asserts non admin users have no 
        access to patch methods.
        """

        request = self.factory.patch('/')
        self.user.is_staff = True
        request.user = self.user
        permission = self.permission_class.has_permission(request, None)
        self.assertFalse(permission)

    def test_non_admin_user_delete_method_returns_false(self):
        """
        asserts non admin users have no 
        access to delete methods.
        """

        request = self.factory.delete('/')
        self.user.is_staff = True
        request.user = self.user
        permission = self.permission_class.has_permission(request, None)
        self.assertFalse(permission)


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
