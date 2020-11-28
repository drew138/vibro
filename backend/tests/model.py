from django.test import TestCase
from backend import models as custom_models
from model_bakery import baker


class TestVibroUser(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.user = baker.make("backend.VibroUser")
        cls.user.email = "randomemail@gmail.com"

    def test_blur_email(self):
        self.assertEqual(
            self.user.blur_email(),
            'rand*****************')
