from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APITestCase
from random import choice, getrandbits
from rest_framework import status
from django.urls import reverse
from model_bakery import baker
from faker import Faker


class TestVibroUserView(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.vibrouser_url = reverse('vibrouser-list')
        cls.company = baker.make('backend.Company')
        cls.user = baker.make('backend.VibroUser')
        cls.user.company = cls.company
        cls.user.save()
        cls.vibrouser_url_detail = reverse(
            'vibrouser-detail', kwargs={"pk": cls.user.id})
        cls.refresh = str(RefreshToken.for_user(cls.user).access_token)
        cls.faker = Faker()

    def test_patch_method(self):
        """
        assert any user can modify relevant fields of their profile.
        """

        user_types = [
            'admin',
            'engineer',
            'client',
            'support',
            'arduino'
        ]
        self.user.is_staff = bool(getrandbits(1))
        self.user.is_superuser = bool(getrandbits(1))
        self.user.user_type = choice(user_types)
        self.user.save()
        self.data = {
            'first_name': self.faker.first_name(),
            'last_name': self.faker.last_name(),
            'phone': self.faker.random_number(),
            'ext': self.faker.random_number(),
            'celphone': self.faker.random_number(),
            'company': self.company.id,
            'user_type': choice(user_types),
            'certifications': [self.faker.word() for _ in range(4)]
        }

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.refresh}')
        res = self.client.patch(self.vibrouser_url_detail, data=self.data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['first_name'], self.data['first_name'])
        self.assertEqual(res.data['last_name'], self.data['last_name'])
        self.assertEqual(res.data['phone'], self.data['phone'])
        self.assertEqual(res.data['ext'], self.data['ext'])
        self.assertEqual(res.data['celphone'], self.data['celphone'])
        if self.user.user_type in {"admin", "engineer"}:
            self.assertEqual(res.data['certifications'],
                             self.data['certifications'])
        else:
            self.assertEqual(res.data['certifications'], [])
        if self.user.is_superuser or self.user.is_staff:
            self.assertEqual(res.data['user_type'], self.data['user_type'])
        else:
            self.assertEqual(res.data['user_type'], self.user.user_type)

    def test_get_method(self):
        """
        veriffy any user can get users data. (profiles)
        """

        self.data = {
            'id': self.user.id,
            'user_type': self.user.user_type,
            'company_name': self.user.company.name,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name
        }

        self.refresh = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.refresh}')
        res = self.client.get(self.vibrouser_url_detail, self.data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_post_method_not_allowed(self):
        """
        assert post methods are not allowed.
        """

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.refresh}')
        res = self.client.post(self.vibrouser_url)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_put_method_not_allowed(self):
        """
        assert put method is not allowed.
        """

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.refresh}')
        res = self.client.put(self.vibrouser_url_detail)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_method_not_allowed(self):
        """
        assert delete method is forbidden.
        """

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.refresh}')
        res = self.client.delete(self.vibrouser_url_detail)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_users_not_allowed(self):
        """
        assert non authenticated users are not allowed.
        """

        res = self.client.patch(self.vibrouser_url)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
