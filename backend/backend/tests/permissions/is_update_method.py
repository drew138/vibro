from backend import permissions as custom_permissions
from django.test import TestCase, RequestFactory


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
