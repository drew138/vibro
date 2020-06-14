from django.contrib.auth import authenticate
from rest_framework import serializers
from . import models as custom_models


class CitySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = custom_models.City
        fields = '__all__'


class CompanySerializer(serializers.ModelSerializer):

    city = CitySerializer()

    rut_city = CitySerializer()

    class Meta:
        model = custom_models.Company
        fields = '__all__'


# User Serializer
class VibroUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = custom_models.VibroUser
        fields = [
            'id',
            'username',
            'email',
            'company',
            ]


# Register Serializer
class RegisterVibroUserSerializer(serializers.ModelSerializer):

    company = CompanySerializer(required=False)

    class Meta:
        model = custom_models.VibroUser
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
        user = custom_models.VibroUser.objects.create_user(**validated_data)
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


# Rest Password Serializer
class ResetSerializer(serializers.Serializer):

    username = serializers.CharField(required=False)
    first_name = serializers.CharField(required=False)

    class Meta:
        model = custom_models.VibroUser
        fields = [
            'id',
            'username',
            'first_name',
            'email',
            ]
    

# Change Password Serializer
class ChangePassSerializer(serializers.Serializer):

    username = serializers.CharField(required=False)

    class Meta:
        model = custom_models.VibroUser
        fields = ['username', 'password']

    def update(self, instance, validated_data):
        user = custom_models.VibroUser.objects.update(**validated_data)
        return user


class ProfileSerializer(serializers.ModelSerializer):

    user = VibroUserSerializer()

    class Meta:
        model = custom_models.Profile
        fields = '__all__'


class MachineSerializer(serializers.ModelSerializer):

    company = CompanySerializer() 

    class Meta:
        model = custom_models.Machine
        fields = '__all__'


class ImageSerializer(serializers.ModelSerializer):

    machine = MachineSerializer()

    class Meta:
        model = custom_models.Image
        fields = '__all__'


class MeasurementSerializer(serializers.ModelSerializer):

    machine = MachineSerializer()

    class Meta:
        model = custom_models.Measurement
        fields = '__all__'


class TermoImageSerializer(serializers.ModelSerializer):

    measurement = MeasurementSerializer()

    class Meta:
        model = custom_models.TermoImage
        fields = '__all__'


class PointSerializer(serializers.ModelSerializer):

    measurement = MeasurementSerializer()

    class Meta:
        model = custom_models.Point
        fields = '__all__'


class TendencySerializer(serializers.ModelSerializer):

    point = PointSerializer()

    class Meta:
        model = custom_models.Tendency
        fields = '__all__'


class EspectraSerializer(serializers.ModelSerializer):

    point = PointSerializer()

    class Meta:
        model = custom_models.Espectra
        fields = '__all__'


class TimeSignalSerializer(serializers.ModelSerializer):

    point = PointSerializer()

    class Meta:
        model = custom_models.TimeSignal
        fields = '__all__'