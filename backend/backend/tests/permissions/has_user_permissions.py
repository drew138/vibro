from backend import permissions as custom_permissions
from django.contrib.auth.models import AnonymousUser
from django.test import TestCase, RequestFactory
from model_bakery import baker


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

    def test_get_method_returns_true(self):
        """
        asserts non admin users have  
        access to get methods.
        """

        request = self.factory.get('/')
        request.user = self.user
        permission = self.permission_class.has_permission(request, None)
        self.assertTrue(permission)

    def test_put_method_returns_false(self):
        """
        asserts non admin users have 
        access to put methods.
        """

        request = self.factory.put('/')
        self.user.is_staff = True
        request.user = self.user
        permission = self.permission_class.has_permission(request, None)
        self.assertFalse(permission)

    def test_patch_method_returns_true(self):
        """
        asserts non admin users have no 
        access to patch methods.
        """

        request = self.factory.patch('/')
        request.user = self.user
        permission = self.permission_class.has_permission(request, None)
        self.assertTrue(permission)

    def test_delete_method_returns_false(self):
        """
        asserts non admin users have no 
        access to delete methods.
        """

        request = self.factory.delete('/')
        self.user.is_staff = True
        request.user = self.user
        permission = self.permission_class.has_permission(request, None)
        self.assertFalse(permission)
