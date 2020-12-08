from rest_framework_simplejwt.tokens import RefreshToken
from backend.models import Point, Measurement
from rest_framework.test import APITestCase
from random import choice, uniform
from rest_framework import status
from django.urls import reverse
from model_bakery import baker
from faker import Faker


# TODO
class TestMeasurementView(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.measurement_url = reverse('measurement-list')
        cls.user = baker.make('backend.VibroUser')
        cls.faker = Faker()

    def setUp(self):
        self.data = {
            "measurement": self.measurement.id,
            "description": self.faker.sentence(),
            "image": self.faker.file_name(extension='png'),
        }
