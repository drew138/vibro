from django.test import TestCase
from backend import models as custom_models
from model_bakery import baker


class TestVibroUser(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.user = baker.make("backend.VibroUser")
        cls.user.email = "randomemail@gmail.com"
        cls.user.first_name = "name"
        cls.user.last_name = "last"

    def test_blur_email(self):
        self.assertEqual(
            self.user.blur_email(),
            'rand*****************')

    def test_str(self):
        self.assertEqual(self.user.__str__(), "name last")


class TestPoint(TestCase):

    @classmethod
    def setUpTestData(cls):
        measurement = baker.make("backend.Measurement")
        cls.point = custom_models.Point.objects.create(
            number=1,
            position="V",
            point_type="V",
            measurement=measurement,
            tendency=1.1,
            espectra=[1.1],
            time_signal=[1.1]
        )

    def test_str(self):
        self.assertEqual(self.point.__str__(), "1VV")
