from backend import models as custom_models
from django.test import TestCase
from model_bakery import baker


class TestCity(TestCase):

    def setUp(self):
        self.city = baker.make("backend.City")
        self.name = self.city.name

    def test_str(self):
        """
        test str dunder method.
        """

        self.assertEqual(self.city.__str__(), self.name)
