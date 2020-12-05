from backend.serializers import RegisterVibroUserSerializer, RegisterAdminUserSerializer
from random import choice, getrandbits
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
        name = faker.name()
        data = {
            'username': profile['username'],
            'first_name': name.split()[0],
            'last_name': name.split()[1],
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


class TestRegisterAdminUserSerializer(TestCase):

    def test_create_method(self):
        """
        assert serializer_class can
        successfully create requested users.
        """

        faker = Faker()
        serializer_class = RegisterAdminUserSerializer()
        company = baker.make('backend.Company')
        profile = faker.profile(fields=['username'])
        name = faker.name()
        user_types = [
            'admin',
            'engineer',
            'client',
            'support',
            'arduino'
        ]
        data = {
            'username': profile['username'],
            'first_name': name.split()[0],
            'last_name': name.split()[1],
            'email': faker.email(),
            'company': company,
            'password': faker.text,
            'phone': faker.random_number(),
            'ext': faker.random_number(),
            'celphone': faker.random_number(),
            'user_type': choice(user_types),
            'is_staff': bool(getrandbits(1)),
            'is_superuser': bool(getrandbits(1))
        }
        user = serializer_class.create(data)
        instance = VibroUser.objects.filter(id=user.id)
        self.assertTrue(instance.exists())
