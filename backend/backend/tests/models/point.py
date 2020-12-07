from backend import models as custom_models
from django.test import TestCase
from model_bakery import baker


class TestPoint(TestCase):

    @classmethod
    def setUpTestData(cls):
        measurement = baker.make("backend.Measurement")
        cls.point = custom_models.Point.objects.create(
            position=1,
            direction="V",
            point_type="V",
            measurement=measurement,
            tendency=1.1,
            espectra=[1.1],
            time_signal=[1.1]
        )

    def test_str(self):
        """
        test str dunder method.
        """

        self.assertEqual(self.point.__str__(), "1VV")
