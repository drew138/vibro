from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from model_bakery import baker
from faker import Faker


# TODO
class TestCompanyView(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.company_url = reverse('company-list')
        cls.user = baker.make('backend.VibroUser')
        cls.city = baker.make("backend.City")
        cls.faker = Faker()
        cls.nit = cls.faker.random_number()

    def setUp(self):
        self.data = {
            "name": self.faker.name(),
            "nit": self.nit + 1,
            "address": self.faker.pystr(max_chars=50),
            "rut_address": self.faker.pystr(max_chars=50),
            "pbx": self.faker.random_number(),
            "city": self.city.id,
            "rut_city": self.city.id,
        }
        self.nit += 1

    def test_admin_can_post_company(self):
        """
        """

        self.user.is_superuser = True
        self.user.save()
        refresh = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.post(self.company_url, self.data, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["name"], self.data["name"])
        self.assertEqual(int(res.data["nit"]), self.data["nit"])
        self.assertEqual(res.data["address"], self.data["address"])
        self.assertEqual(res.data["rut_address"], self.data["rut_address"])
        self.assertEqual(res.data["pbx"], self.data["pbx"])
        self.assertEqual(res.data["city"], self.data["city"])
        self.assertEqual(res.data["rut_city"], self.data["rut_city"])

    def test_staff_can_post_company(self):
        """
        """

        self.user.is_staff = True
        self.user.save()
        refresh = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.post(self.company_url, self.data, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["name"], self.data["name"])
        self.assertEqual(int(res.data["nit"]), self.data["nit"])
        self.assertEqual(res.data["address"], self.data["address"])
        self.assertEqual(res.data["rut_address"], self.data["rut_address"])
        self.assertEqual(res.data["pbx"], self.data["pbx"])
        self.assertEqual(res.data["city"], self.data["city"])
        self.assertEqual(res.data["rut_city"], self.data["rut_city"])

    def test_client_user_cant_post_company(self):
        """
        """

        self.user.is_staff = False
        self.user.is_superuser = False
        self.user.save()
        refresh = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.post(self.company_url, self.data, format="json")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_delete_company(self):
        """
        """

        self.user.is_superuser = True
        self.user.save()
        refresh = str(RefreshToken.for_user(self.user).access_token)
        company = baker.make('backend.Company')
        company_url_detail = reverse(
            'company-detail', kwargs={"pk": company.id})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.delete(company_url_detail)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_staff_can_delete_company(self):
        """
        """

        self.user.is_staff = True
        self.user.save()
        refresh = str(RefreshToken.for_user(self.user).access_token)
        company = baker.make('backend.Company')
        company_url_detail = reverse(
            'company-detail', kwargs={"pk": company.id})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.delete(company_url_detail)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_client_user_cant_delete_company(self):
        """
        """

        self.user.is_staff = False
        self.user.is_superuser = False
        self.user.save()
        refresh = str(RefreshToken.for_user(self.user).access_token)
        company = baker.make('backend.Company')
        company_url_detail = reverse(
            'company-detail', kwargs={"pk": company.id})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.delete(company_url_detail)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_patch_company(self):
        """
        """

        self.user.is_superuser = True
        self.user.save()
        refresh = str(RefreshToken.for_user(self.user).access_token)
        company = baker.make('backend.Company')
        company_url_detail = reverse(
            'company-detail', kwargs={"pk": company.id})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.patch(company_url_detail, self.data, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["name"], self.data["name"])
        self.assertEqual(int(res.data["nit"]), self.data["nit"])
        self.assertEqual(res.data["address"], self.data["address"])
        self.assertEqual(res.data["rut_address"], self.data["rut_address"])
        self.assertEqual(res.data["pbx"], self.data["pbx"])
        self.assertEqual(res.data["city"], self.data["city"])
        self.assertEqual(res.data["rut_city"], self.data["rut_city"])

    def test_staff_can_patch_company(self):
        """
        """

        self.user.is_staff = True
        self.user.save()
        refresh = str(RefreshToken.for_user(self.user).access_token)
        company = baker.make('backend.Company')
        company_url_detail = reverse(
            'company-detail', kwargs={"pk": company.id})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.patch(company_url_detail, self.data, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["name"], self.data["name"])
        self.assertEqual(int(res.data["nit"]), self.data["nit"])
        self.assertEqual(res.data["address"], self.data["address"])
        self.assertEqual(res.data["rut_address"], self.data["rut_address"])
        self.assertEqual(res.data["pbx"], self.data["pbx"])
        self.assertEqual(res.data["city"], self.data["city"])
        self.assertEqual(res.data["rut_city"], self.data["rut_city"])

    def test_client_user_can_patch_company(self):
        """
        """

        self.user.is_superuser = False
        self.user.is_staff = False
        self.user.save()
        refresh = str(RefreshToken.for_user(self.user).access_token)
        company = baker.make('backend.Company')
        company_url_detail = reverse(
            'company-detail', kwargs={"pk": company.id})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.patch(company_url_detail, self.data, format="json")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
