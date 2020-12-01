from django.test import TestCase
from backend import models as custom_models
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


class TestVibroUser(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.user = baker.make("backend.VibroUser")
        cls.user.email = "randomemail@gmail.com"
        cls.user.first_name = "name"
        cls.user.last_name = "last"

    def test_blur_email(self):
        """
        assert email is being blurred correctly.
        """

        self.assertEqual(
            self.user.blur_email(),
            'rand*****************')

    def test_str(self):
        """
        test str dunder method.
        """

        self.assertEqual(self.user.__str__(), "name last")


class TestDate(TestCase):

    def setUp(self):
        self.date = baker.make("backend.Date")
        self.company = self.date.company.name
        self.date_object = self.date.date

    def test_str(self):
        """
        test str dunder method.
        """

        self.assertEqual(
            self.date.__str__(),
            f"{self.company} {self.date_object}")


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
