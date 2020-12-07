from rest_framework.test import APITestCase
from django.urls import reverse
from model_bakery import baker


class TestSetUp(APITestCase):

    @classmethod
    def setUpTestData(cls):

        cls.register_url = reverse('register')
        cls.register_admin_url = reverse('register-admin')
        cls.reset_url = reverse('reset')
        cls.change_password_url = reverse('change')
        cls.forgot_password_url = reverse('change-forgot')

        cls.company_url = reverse('company-list')

        cls.machine_url = reverse('machine-list')
        cls.sensor_url = reverse('sensor-list')
        cls.gear_url = reverse('gear-list')
        cls.axis_url = reverse('axis-list')
        cls.bearing_url = reverse('bearing-list')
        cls.coupling_url = reverse('coupling-list')
        cls.image_url = reverse('image-list')
        cls.date_url = reverse('date-list')
        cls.measurement_url = reverse('measurement-list')
        cls.flaw_url = reverse('flaw-list')
        cls.report_url = reverse('report-list')
        cls.termal_url = reverse('termal-list')
        cls.point_url = reverse('point-list')
