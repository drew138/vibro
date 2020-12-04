from rest_framework import serializers
from . import models as custom_models


class CitySerializer(serializers.ModelSerializer):

    class Meta:
        model = custom_models.City
        fields = '__all__'


class DefaultCompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = custom_models.Company
        fields = '__all__'


class GetCompanySerializer(serializers.ModelSerializer):

    city = serializers.StringRelatedField(read_only=True)

    rut_city = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = custom_models.Company
        fields = '__all__'


# User Serializer
class VibroUserSerializer(serializers.ModelSerializer):

    company = DefaultCompanySerializer(required=False)

    class Meta:
        model = custom_models.VibroUser
        fields = [
            'id',
            'username',
            'email',
            'company',
            'user_type',
            'is_staff',
            'is_superuser'
        ]


# Register Serializer
class RegisterVibroUserSerializer(serializers.ModelSerializer):

    company = DefaultCompanySerializer(required=False)

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
            'celphone',
        ]
        extra_kwargs = {'password': {'write_only': True, 'min_length': 8}}

    def create(self, validated_data):
        user = custom_models.VibroUser.objects.create_user(**validated_data)
        return user


# Register admin Serializer
class RegisterAdminUserSerializer(serializers.ModelSerializer):

    company = DefaultCompanySerializer(required=False)
    user_type = serializers.CharField(required=False)

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
            'celphone',
            'user_type',
            'is_staff',
            'is_superuser'
        ]
        extra_kwargs = {'password': {'write_only': True, 'min_length': 8}}

    def create(self, validated_data):
        user = custom_models.VibroUser.objects.create_user(
            **validated_data)
        return user


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

    model = custom_models.VibroUser
    password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


# Change Password Serializer
class ForgotPassSerialiazer(serializers.Serializer):

    model = custom_models.VibroUser
    password = serializers.CharField(required=True)


class UpdadateUserSerialiazer(serializers.ModelSerializer):

    class Meta:
        model = custom_models.VibroUser
        fields = [
            'phone',
            'ext',
            'celphone',
            'company',
            'user_type',
            'certifications',
            'picture',
        ]


class MachineSerializer(serializers.ModelSerializer):

    # company = DefaultCompanySerializer()

    class Meta:
        model = custom_models.Machine
        fields = '__all__'


class SensorSerializer(serializers.ModelSerializer):

    # machine = MachineSerializer()

    class Meta:
        model = custom_models.Sensor
        fields = "__all__"


class GearSerializer(serializers.ModelSerializer):

    # machine = MachineSerializer()

    class Meta:
        model = custom_models.Gear
        fields = "__all__"


class AxisSerializer(serializers.ModelSerializer):

    # gear = GearSerializer()

    class Meta:
        model = custom_models.Axis
        fields = '__all__'


class BearingSerializer(serializers.ModelSerializer):

    # axis = AxisSerializer()

    class Meta:
        model = custom_models.Bearing
        fields = '__all__'


class CouplingSerializer(serializers.ModelSerializer):

    # gear = GearSerializer()

    class Meta:
        model = custom_models.Coupling
        feilds = '__all__'


class ImageSerializer(serializers.ModelSerializer):

    # machine = MachineSerializer()

    class Meta:
        model = custom_models.Image
        fields = '__all__'


class DateSerializer(serializers.ModelSerializer):

    # company = DefaultCompanySerializer()

    class Meta:
        model = custom_models.Date
        fields = '__all__'


class MeasurementSerializer(serializers.ModelSerializer):

    # machine = MachineSerializer()
    # engineer_one = VibroUserSerializer()
    # engineer_two = VibroUserSerializer()
    # analyst = VibroUserSerializer()
    # certifier = VibroUserSerializer()

    class Meta:
        model = custom_models.Measurement
        fields = '__all__'


class FlawSerializer(serializers.ModelSerializer):

    # measurement = MeasurementSerializer()

    class Meta:
        model = custom_models.Flaw
        fields = '__all__'


class TermoImageSerializer(serializers.ModelSerializer):

    # measurement = MeasurementSerializer()

    class Meta:
        model = custom_models.TermoImage
        fields = '__all__'


class PointSerializer(serializers.ModelSerializer):

    # measurement = MeasurementSerializer()

    class Meta:
        model = custom_models.Point
        fields = '__all__'
