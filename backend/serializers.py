from rest_framework import serializers
from .models import City, Company, VibroUser, Machine, Image, Measurement, Point
from django.contrib.auth import authenticate

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


class VibroUserSerializer(serializers.ModelSerializer):

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

    def create(self, validated_data):
        user = VibroUser.objects.create_user(**validated_data)
        return user


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


class PointSerializer(serializers.ModelSerializer):

    measurement = MeasurementSerializer()

    class Meta:
        model = Point
        fields = '__all__'
