from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from model_bakery import baker
from faker import Faker


class TestCityView(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.city_url = reverse('city-list')
        cls.user = baker.make('backend.VibroUser')

    def setUp(self):
        super().setUp()
        faker = Faker()
        self.city = baker.make('backend.City')
        self.data = {
            "name": faker.city(),
            "state": faker.state()
        }

    def test_admin_can_post_city(self):
        """
        assert admin can create a new city,
        and check ofr city data in response.
        """

        self.user.is_superuser = True
        self.user.save()
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        res = self.client.post(self.city_url, self.data, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['name'], self.data['name'])
        self.assertEqual(res.data['state'], self.data['state'])

    def test_staff_can_post_city(self):
        """
        assert staff users can create a new city,
        and check ofr city data in response.
        """

        self.user.is_staff = True
        self.user.save()
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        res = self.client.post(self.city_url, self.data, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['name'], self.data['name'])
        self.assertEqual(res.data['state'], self.data['state'])

    def test_client_cant_post_city(self):
        """
        assert client users are fobidden
        from creating new cities.
        """

        self.user.is_staff = False
        self.user.is_superuser = False
        self.user.user_type = 'client'
        self.user.save()
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        res = self.client.post(self.city_url, self.data, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_post_requires_body(self):
        """
        assert creating a new city requires 
        related information in json body.
        """

        self.user.is_staff = True
        self.user.save()
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        res = self.client.post(self.city_url, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_can_get_city(self):
        """
        assert any type of user can
        retrieve cities.
        """

        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        res = self.client.get(self.city_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['results'][0]['id'], self.city.id)
        self.assertEqual(res.data['results'][0]['name'], self.city.name)
        self.assertEqual(res.data['results'][0]['state'], self.city.state)
        self.assertEqual(res.data['count'], 1)

    def test_user_can_get_filtered_city(self):
        """
        assert any type of user can
        filter and retrieve cities.
        """

        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        params = {
            'id': self.city.id,
            'name': self.city.name,
            'state': self.city.state,
        }
        res = self.client.get(self.city_url, data=params)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['results'][0]['id'], self.city.id)
        self.assertEqual(res.data['results'][0]['name'], self.city.name)
        self.assertEqual(res.data['results'][0]['state'], self.city.state)
        self.assertEqual(res.data['count'], 1)

    def test_admin_can_delete_city(self):
        """
        assert admin users can delete
        city instances.
        """

        self.user.is_superuser = True
        self.user.save()
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        city_url_detail = reverse('city-detail', kwargs={"pk": self.city.id})
        res = self.client.delete(city_url_detail)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_staff_can_delete_city(self):
        """
        assert staff users can delete
        city instances.
        """

        self.user.is_staff = True
        self.user.save()
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        city_url_detail = reverse('city-detail', kwargs={"pk": self.city.id})
        res = self.client.delete(city_url_detail)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_client_cant_delete_city(self):
        """
        assert client users cant delete
        city instances.
        """

        self.user.is_staff = False
        self.user.is_superuser = False
        self.user.user_type = 'client'
        self.user.save()
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        city_url_detail = reverse('city-detail', kwargs={"pk": self.city.id})
        res = self.client.delete(city_url_detail)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_patch_city(self):
        """
        assert admin users can update
        city instances.
        """

        self.user.is_superuser = True
        self.user.save()
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        city_url_detail = reverse('city-detail', kwargs={"pk": self.city.id})
        res = self.client.patch(city_url_detail, self.data, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['name'], self.data['name'])
        self.assertEqual(res.data['state'], self.data['state'])

    def test_staff_can_patch_city(self):
        """
        assert staff users can update
        city instances.
        """

        self.user.is_staff = True
        self.user.save()
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        city_url_detail = reverse('city-detail', kwargs={"pk": self.city.id})
        res = self.client.patch(city_url_detail, self.data, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['name'], self.data['name'])
        self.assertEqual(res.data['state'], self.data['state'])

    def test_client_cant_patch_city(self):
        """
        assert client users cant update
        city instances.
        """

        self.user.is_superuser = False
        self.user.is_staff = False
        self.user.user_type = 'client'
        self.user.save()
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        city_url_detail = reverse('city-detail', kwargs={"pk": self.city.id})
        res = self.client.patch(city_url_detail, self.data, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
