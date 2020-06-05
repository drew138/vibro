from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import *


class CitySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = City
        fields = '__all__'


class CompanySerializer(serializers.ModelSerializer):

    city = CitySerializer()

    rut_city = CitySerializer()

    class Meta:
        model = Company
        fields = '__all__'


# User Serializer
class VibroUserSerializer(serializers.ModelSerializer):

    company = CompanySerializer()

    class Meta:
        model = VibroUser
        fields = [
            'id',
            'username',
            'email',
            ]

    def create(self, validated_data):
        user = VibroUser.objects.create_user(**validated_data)
        return user


# Register Serializer
class RegisterVibroUserSerializer(serializers.ModelSerializer):

    company = CompanySerializer()

    class Meta:
        model = VibroUser
        fields = [
            'username',
            'first_name',
            'last_name',
            'email',
            'company',
            'password',
            'phone',
            'ext',
            'celphone_one',
            'celphone_two'
            ]
        extra_kwargs = {'password': {'write_only': True, 'min_length': 8}}  # TODO check if kwargs are valid

    def create(self, validated_data):
        user = VibroUser.objects.create_user(**validated_data)
        return user


# Login Serializer
class LoginVibroUserSerializer(serializers.Serializer):

    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError('Credenciales Incorrectas')


class MachineSerializer(serializers.ModelSerializer):

    company = CompanySerializer() 

    class Meta:
        model = Machine
        fields = '__all__'


class ImageSerializer(serializers.ModelSerializer):

    machine = MachineSerializer()

    class Meta:
        model = Image
        fields = '__all__'


class MeasurementSerializer(serializers.ModelSerializer):

    machine = MachineSerializer()

    class Meta:
        model = Measurement
        fields = '__all__'


class TermoImageSerializer(serializers.ModelSerializer):

    measurement = MeasurementSerializer()

    class Meta:
        model = TermoImage
        fields = '__all__'


class PointSerializer(serializers.ModelSerializer):

    measurement = MeasurementSerializer()

    class Meta:
        model = Point
        fields = '__all__'


class TendencySerializer(serializers.ModelSerializer):

    point = PointSerializer()

    class Meta:
        model = Tendency
        fields = '__all__'


class EspectraSerializer(serializers.ModelSerializer):

    point = PointSerializer()

    class Meta:
        model = Espectra
        fields = '__all__'


class TimeSignalSerializer(serializers.ModelSerializer):

    point = PointSerializer()

    class Meta:
        model = TimeSignal
        fields = '__all__'