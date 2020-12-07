from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from model_bakery import baker


class TestUserAPI(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.user_url = reverse('user')
        cls.user = baker.make('backend.VibroUser')
        cls.refresh = str(RefreshToken.for_user(cls.user).access_token)

    def test_get_method_is_allowed_with_authenticated_user(self):
        """
        assert any authenticated user is
        allowed to retrieve their user data.
        """

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.refresh}')
        res = self.client.get(self.user_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['id'], self.user.id)
        self.assertEqual(res.data['username'], self.user.username)
        self.assertEqual(res.data['email'], self.user.email)
        self.assertEqual(res.data['company'], self.user.company)
        self.assertEqual(res.data['user_type'], self.user.user_type)
        self.assertEqual(res.data['is_staff'], self.user.is_staff)
        self.assertEqual(res.data['is_superuser'], self.user.is_superuser)

    def test_get_method_is_not_allowed_with_unauthenticated_user(self):
        """
        assert non authenticated users
        can not access user data.
        """

        res = self.client.get(self.user_url)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_method_is_not_allowed(self):
        """
        assert post method is not allowed.
        """

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.refresh}')
        res = self.client.post(self.user_url)
        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_delete_method_is_not_allowed(self):
        """
        assert delete method is not allowed.
        """

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.refresh}')
        res = self.client.delete(self.user_url)
        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_patch_method_is_not_allowed(self):
        """
        assert patch method is not allowed.
        """

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.refresh}')
        res = self.client.patch(self.user_url)
        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_put_method_is_not_allowed(self):
        """
        assert put method is not allowed.
        """

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.refresh}')
        res = self.client.put(self.user_url)
        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
