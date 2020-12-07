from django.test import TestCase
from model_bakery import baker


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
