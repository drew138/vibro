from django.test import TestCase
from model_bakery import baker


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
