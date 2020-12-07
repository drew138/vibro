from backend.serializers import RegisterVibroUserSerializer
from backend.models import VibroUser
from django.test import TestCase
from model_bakery import baker
from faker import Faker


class TestRegisterVibroUserSerializer(TestCase):

    def test_create_method(self):
        """
        assert serializer_class can
        successfully create requested users.
        """

        faker = Faker()
        serializer_class = RegisterVibroUserSerializer()
        company = baker.make('backend.Company')
        profile = faker.profile(fields=['username'])
        data = {
            'username': profile['username'],
            'first_name': faker.first_name(),
            'last_name': faker.last_name(),
            'email': faker.email(),
            'company': company,
            'password': faker.text,
            'phone': faker.random_number(),
            'ext': faker.random_number(),
            'celphone': faker.random_number(),
        }
        user = serializer_class.create(data)
        instance = VibroUser.objects.filter(id=user.id)
        self.assertTrue(instance.exists())
