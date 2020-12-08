from rest_framework_simplejwt.tokens import RefreshToken
from backend.models import Point, Measurement
from rest_framework.test import APITestCase
from random import choice, uniform
from rest_framework import status
from django.urls import reverse
from model_bakery import baker
from faker import Faker


class TestPointView(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.point_url = reverse('point-list')
        cls.user = baker.make('backend.VibroUser')
        cls.measurement = baker.make('backend.Measurement')
        cls.faker = Faker()
        cls.positions = [
            num for num in range(1, 13)
        ]
        cls.directions = [
            'V',
            'H',
            'A',
            'O'
        ]
        cls.point_types = [
            'A',
            'V',
            'D',
            'T',
            'E',
            'H',
            'M',
            'C'
        ]

    def setUp(self):
        self.data = {
            "position": choice(self.positions),
            "direction": choice(self.directions),
            "point_type": choice(self.point_types),
            "measurement": self.measurement.id,
            "tendency": round(uniform(0, 99), 2),
            "espectra": [round(uniform(0, 99), 2) for _ in range(100)],
            "time_signal": [round(uniform(0, 99), 2) for _ in range(100)]
        }

    def test_admin_can_post_point(self):
        """
        assert admin users can create points.
        """

        self.user.is_superuser = True
        self.user.save()
        refresh = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.post(self.point_url, self.data, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["position"], self.data["position"])
        self.assertEqual(res.data["direction"], self.data["direction"])
        self.assertEqual(res.data["point_type"], self.data["point_type"])
        self.assertEqual(res.data["measurement"], self.data["measurement"])
        self.assertEqual(float(res.data["tendency"]), self.data["tendency"])
        self.assertEqual(
            [float(num) for num in res.data["espectra"]], self.data["espectra"])
        self.assertEqual(
            [float(num) for num in res.data["time_signal"]], self.data["time_signal"])

    def test_staff_can_post_point(self):
        """
        assert staff users can create points.
        """

        self.user.is_staff = True
        self.user.save()
        refresh = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.post(self.point_url, self.data, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["position"], self.data["position"])
        self.assertEqual(res.data["direction"], self.data["direction"])
        self.assertEqual(res.data["point_type"], self.data["point_type"])
        self.assertEqual(res.data["measurement"], self.data["measurement"])
        self.assertEqual(float(res.data["tendency"]), self.data["tendency"])
        self.assertEqual(
            [float(num) for num in res.data["espectra"]], self.data["espectra"])
        self.assertEqual(
            [float(num) for num in res.data["time_signal"]], self.data["time_signal"])

    def test_client_user_cant_post_point(self):
        """
        assert client users cant create any points.
        """

        self.user.is_superuser = False
        self.user.is_staff = False
        self.user.save()
        refresh = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.post(self.point_url, self.data, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_delete_point(self):
        """
        assert admin users can delete any points.
        """

        self.user.is_superuser = True
        self.user.save()
        measurement = Measurement.objects.filter(
            id=self.data["measurement"]).first()
        self.data.pop("measurement")
        point = Point.objects.create(measurement=measurement, **self.data)
        point_url_detail = reverse('point-detail', kwargs={"pk": point.id})
        refresh = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.delete(point_url_detail, data=self.data)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_staff_can_delete_point(self):
        """
        assert staff users can delete points.
        """

        self.user.is_staff = True
        self.user.save()
        measurement = Measurement.objects.filter(
            id=self.data["measurement"]).first()
        self.data.pop("measurement")
        point = Point.objects.create(measurement=measurement, **self.data)
        point_url_detail = reverse('point-detail', kwargs={"pk": point.id})
        refresh = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.delete(point_url_detail)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_client_user_cant_delete_point(self):
        """
        assert client users can not delete points.
        """

        self.user.is_staff = False
        self.user.is_superuser = False
        self.user.save()
        measurement = Measurement.objects.filter(
            id=self.data["measurement"]).first()
        self.data.pop("measurement")
        point = Point.objects.create(measurement=measurement, **self.data)
        self.setUp()
        point_url_detail = reverse('point-detail', kwargs={"pk": point.id})
        refresh = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.delete(point_url_detail)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_patch_point(self):
        """
        assert admin users can patch any point.
        """

        self.user.is_superuser = True
        self.user.save()
        measurement = Measurement.objects.filter(
            id=self.data["measurement"]).first()
        self.data.pop("measurement")
        point = Point.objects.create(measurement=measurement, **self.data)
        self.setUp()
        point_url_detail = reverse('point-detail', kwargs={"pk": point.id})
        refresh = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.patch(point_url_detail, data=self.data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["position"], self.data["position"])
        self.assertEqual(res.data["direction"], self.data["direction"])
        self.assertEqual(res.data["point_type"], self.data["point_type"])
        self.assertEqual(res.data["measurement"], self.data["measurement"])
        self.assertEqual(float(res.data["tendency"]), self.data["tendency"])
        self.assertEqual(
            [float(num) for num in res.data["espectra"]], self.data["espectra"])
        self.assertEqual(
            [float(num) for num in res.data["time_signal"]], self.data["time_signal"])

    def test_staff_can_patch_point(self):
        """
        assert staff offer can patch any point.
        """

        self.user.is_staff = True
        self.user.save()
        measurement = Measurement.objects.filter(
            id=self.data["measurement"]).first()
        self.data.pop("measurement")
        point = Point.objects.create(measurement=measurement, **self.data)
        self.setUp()
        point_url_detail = reverse('point-detail', kwargs={"pk": point.id})
        refresh = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.patch(point_url_detail, data=self.data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["position"], self.data["position"])
        self.assertEqual(res.data["direction"], self.data["direction"])
        self.assertEqual(res.data["point_type"], self.data["point_type"])
        self.assertEqual(res.data["measurement"], self.data["measurement"])
        self.assertEqual(float(res.data["tendency"]), self.data["tendency"])
        self.assertEqual(
            [float(num) for num in res.data["espectra"]], self.data["espectra"])
        self.assertEqual(
            [float(num) for num in res.data["time_signal"]], self.data["time_signal"])

    def test_client_user_cant_patch_point(self):
        """
        assert clients can not patch any points.
        """

        self.user.is_superuser = False
        self.user.is_staff = False
        self.user.save()
        measurement = Measurement.objects.filter(
            id=self.data["measurement"]).first()
        self.data.pop("measurement")
        point = Point.objects.create(measurement=measurement, **self.data)
        self.setUp()
        point_url_detail = reverse('point-detail', kwargs={"pk": point.id})
        refresh = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.patch(point_url_detail, data=self.data)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_get_point(self):
        """
        assert admins can get any point.
        """

        self.user.is_superuser = True
        self.user.company = None
        self.user.save()
        measurement = Measurement.objects.filter(
            id=self.data["measurement"]).first()
        self.data.pop("measurement")
        point = Point.objects.create(measurement=measurement, **self.data)
        point.save()
        self.data['id'] = point.id
        self.data["measurement"] = measurement.id
        refresh = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.get(self.point_url, data=self.data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(
            res.data["results"][0]["position"], self.data["position"])
        self.assertEqual(
            res.data["results"][0]["direction"], self.data["direction"])
        self.assertEqual(
            res.data["results"][0]["point_type"], self.data["point_type"])
        self.assertEqual(
            res.data["results"][0]["measurement"], self.data["measurement"])
        self.assertEqual(
            float(res.data["results"][0]["tendency"]), self.data["tendency"])
        self.assertEqual(
            [float(num) for num in res.data["results"][0]["espectra"]], self.data["espectra"])
        self.assertEqual(
            [float(num) for num in res.data["results"][0]["time_signal"]], self.data["time_signal"])

    def test_staff_can_get_point(self):
        """
        assert staff can get any point.
        """

        self.user.is_staff = True
        self.user.company = None
        self.user.save()
        measurement = Measurement.objects.filter(
            id=self.data["measurement"]).first()
        self.data.pop("measurement")
        point = Point.objects.create(measurement=measurement, **self.data)
        point.save()
        self.data['id'] = point.id
        self.data["measurement"] = measurement.id
        refresh = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.get(self.point_url, data=self.data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(
            res.data["results"][0]["position"], self.data["position"])
        self.assertEqual(
            res.data["results"][0]["direction"], self.data["direction"])
        self.assertEqual(
            res.data["results"][0]["point_type"], self.data["point_type"])
        self.assertEqual(
            res.data["results"][0]["measurement"], self.data["measurement"])
        self.assertEqual(
            float(res.data["results"][0]["tendency"]), self.data["tendency"])
        self.assertEqual(
            [float(num) for num in res.data["results"][0]["espectra"]], self.data["espectra"])
        self.assertEqual(
            [float(num) for num in res.data["results"][0]["time_signal"]], self.data["time_signal"])

    def test_client_can_get_point(self):
        """
        assert clients can get any point 
        instances of their company.
        """

        self.user.is_superuser = False
        self.user.is_staff = False
        self.user.company = None
        self.user.save()
        measurement = Measurement.objects.filter(
            id=self.data["measurement"]).first()
        self.data.pop("measurement")
        point = Point.objects.create(measurement=measurement, **self.data)
        point.save()
        self.data['id'] = point.id
        self.data["measurement"] = measurement.id
        refresh = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh}')
        res = self.client.get(self.point_url, data=self.data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # client wont get results as his queries will be filtered by his company
        self.assertEqual(res.data["results"], [])
