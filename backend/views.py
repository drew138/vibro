from .permissions import IsStaffOrSuperUser, CanUpdatePass, CanGenerateReport, IsArduinoNode
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError, NotFound
from rest_framework import viewsets, generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from . import serializers as custom_serializers
from rest_framework.response import Response
from . import models as custom_models
from rest_framework import status
from .tasks import send_email
import jwt


class CityView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.CitySerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields on the City table
        based on url parameter. 
        """

        id = self.request.query_params.get('id', None)
        name = self.request.query_params.get('name', None)
        state = self.request.query_params.get('state', None)
        queryset = custom_models.City.objects.all()
        if id is not None:
            queryset = queryset.filter(id=id)
        if name is not None:
            queryset = queryset.filter(name=name)
        if state is not None:
            queryset = queryset.filter(state=state)
        return queryset


class CompanyView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.CompanySerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url. For non staff/superusers,
        companies are always filtered by user to prevent users from 
        seeing unauthorized data.
        """

        id = self.request.query_params.get('id', None)
        name = self.request.query_params.get('name', None)
        nit = self.request.query_params.get('name', None)
        address = self.request.query_params.get('address', None)
        rut_address = self.request.query_params.get('rut_address', None)
        pbx = self.request.query_params.get('pbx', None)
        city_id = self.request.query_params.get('city_id', None)
        rut_city_id = self.request.query_params.get('rut_city_id', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = self.request.user.company
            return queryset
        else:
            queryset = custom_models.Company.objects.all()
        if id is not None:
            queryset = queryset.filter(id=id)
        if name is not None:
            queryset = queryset.filter(name=name)
        if nit is not None:
            queryset = queryset.filter(nit=nit)
        if address is not None:
            queryset = queryset.filter(address=address)
        if rut_address is not None:
            queryset = queryset.filter(rut_address=rut_address)
        if pbx is not None:
            queryset = queryset.filter(pbx=pbx)
        if city_id is not None:
            queryset = queryset.filter(city__id=city_id)
        if rut_city_id is not None:
            queryset = queryset.filter(rut_city__id=rut_city_id)
        return queryset


# Get User API
class UserAPI(generics.RetrieveAPIView):

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = custom_serializers.VibroUserSerializer

    def get_object(self):
        """
        get user object
        """

        return self.request.user


# Register API
class RegisterAPI(generics.GenericAPIView):

    serializer_class = custom_serializers.RegisterVibroUserSerializer

    @staticmethod
    def get_email_data(user):
        """
        return object with relevant data to 
        be used in send_email function.
        """

        return {
            'subject': 'Bienvenido! - Vibromontajes',
            'template': 'email/welcome.html',
            'variables': {
                'user': user.first_name,
            }
        }

    def post(self, request, *args, **kwargs):
        """
        create a new user and respond accoringly to user.
        """

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        data = self.get_email_data(user)
        send_email.delay(data, user)
        refresh = RefreshToken.for_user(self.request.user)
        return Response({
            "user": custom_serializers.VibroUserSerializer(
                user,
                context=self.get_serializer_context()).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })


# Reset API
class ResetAPI(generics.GenericAPIView):

    serializer_class = custom_serializers.ResetSerializer

    @staticmethod
    def get_email_data(request, user, refresh):
        """
        return object with relevant data to 
        be used in send_email function.
        """

        return {
            'subject': 'Cambio de Contraseña - Vibromontajes',
            'template': 'email/password_reset.html',
            'variables': {
                'user': user.first_name,
                'host': request.get_host(),
                'username': user.username,
                'token': str(refresh.access_token)
            }
        }

    def post(self, request, *args, **kwargs):
        """
        confirm existence of user, generate jwt 
        for recovery and respond to user accordingly.
        """

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = custom_models.VibroUser.objects.filter(
            email=request.data['email']).first()
        if user.exists():
            refresh = RefreshToken.for_user(user)
            data = self.get_email_data(request, user, refresh)
            send_email.delay(data, user)
        else:
            raise NotFound('usuario no encontrado')
        return Response({"detail": f"un correo de recuperacion ha sido enviado a la cuenta {user.blur_email()}"})


# Change Password API
class ChangePassAPI(generics.UpdateAPIView):

    permission_classes = [
        permissions.IsAuthenticated & CanUpdatePass
    ]

    serializer_class = custom_serializers.ChangePassSerializer

    @staticmethod
    def get_email_data(user):
        """
        return object with relevant data to 
        be used in send_email function.
        """

        return {
            'subject': 'Cambio de Contraseña - Vibromontajes',
            'template': 'email/successful_change.html',
            'variables': {
                'user': user.username,
            }
        }

    def update(self, request, *args, **kwargs):
        """
        Change password of user granted they know their previous password.
        """

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            if not self.get_object().check_password(serializer.data.get("password")):
                return Response({"Error": "Contraseña incorrecta"}, status=status.HTTP_400_BAD_REQUEST)
            user = self.get_object()
            try:
                validate_password(serializer.data.get("new_password"))
            except Exception as e:
                return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get("new_password"))
            user.save()
            data = self.get_email_data(user)
            send_email.delay(data, user)
            refresh = RefreshToken.for_user(user)
            return Response({
                "user": custom_serializers.VibroUserSerializer(
                    user,
                    context=self.get_serializer_context()).data,
                "refresh": str(refresh),
                'access': str(refresh.access_token)
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_object(self):
        """
        get user object
        """

        return self.request.user


class ForgotPassAPI(generics.UpdateAPIView):

    permission_classes = [
        permissions.IsAuthenticated & CanUpdatePass
    ]

    serializer_class = custom_serializers.ForgotPassSeriazliaer

    @staticmethod
    def get_email_data(user):
        """
        return object with relevant data to 
        be used in send_email function.
        """

        return {
            'subject': 'Cambio de Contraseña - Vibromontajes',
            'template': 'email/successful_change.html',
            'variables': {
                'user': user.username,
            }
        }

    def update(self, request, *args, **kwargs):
        """
        Change password of user provided they have forgotten their password.
        """

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = self.get_object()
            try:
                validate_password(serializer.data.get("new_password"))
            except Exception as e:
                return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get("password"))
            user.save()
            data = self.get_email_data(user)
            send_email.delay(data, user)
            refresh = RefreshToken.for_user(user)
            return Response({
                "user": custom_serializers.VibroUserSerializer(
                    user,
                    context=self.get_serializer_context()).data,
                "refresh": str(refresh),
                'access': str(refresh.access_token)
            },
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_object(self):
        """
        get user object
        """

        return self.request.user


class ProfileView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.ProfileSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields in the Profile table
        based on url parameters. 
        """

        id = self.request.query_params.get('id', None)
        user_id = self.request.query_params.get('user_id', None)

        queryset = custom_models.Profile.objects.all()
        if id is not None:
            queryset = queryset.filter(id=id)
        if user_id is not None:
            queryset = queryset.filter(user__id=user_id)
        return queryset


class MachineView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.MachineSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url. For non staff/superusers,
        machines are always filtered by user to prevent users from 
        seeing unauthorized data.
        """

        id = self.request.query_params.get('id', None)
        identifier = self.request.query_params.get('identifier', None)
        company_id = self.request.query_params.get('company_id', None)
        name = self.request.query_params.get('name', None)
        code = self.request.query_params.get('code', None)
        electric_feed = self.request.query_params.get('electric_feed', None)
        transmission = self.request.query_params.get('transmission', None)
        brand = self.request.query_params.get('brand', None)
        power = self.request.query_params.get('power', None)
        power_units = self.request.query_params.get('power_units', None)
        norm = self.request.query_params.get('norm', None)
        hierarchy = self.request.query_params.get('hierarchy', None)
        rpm = self.request.query_params.get('rpm', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = custom_models.Machine.objects.filter(
                company__user=self.request.user)
        else:
            queryset = custom_models.Machine.objects.all()
        if id is not None:
            queryset = queryset.filter(id=id)
        if identifier is not None:
            queryset = queryset.filter(identifier=identifier)
        if company_id is not None:
            queryset = queryset.filter(company__id=company_id)
        if name is not None:
            queryset = queryset.filter(name=name)
        if code is not None:
            queryset = queryset.filter(code=code)
        if electric_feed is not None:
            queryset = queryset.filter(electric_feed=electric_feed)
        if transmission is not None:
            queryset = queryset.filter(transmission=transmission)
        if brand is not None:
            queryset = queryset.filter(brand=brand)
        if power is not None:
            queryset = queryset.filter(power=power)
        if power_units is not None:
            queryset = queryset.filter(power_units=power_units)
        if norm is not None:
            queryset = queryset.filter(norm=norm)
        if hierarchy is not None:
            queryset = queryset.filter(hierarchy=hierarchy)
        if rpm is not None:
            queryset = queryset.filter(rpm=rpm)
        return queryset


class SensorView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.SensorSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url parameters. For non 
        staff/superusers, sensors are always filtered by user  
        to prevent users from seeing unauthorized data.
        """

        id = self.request.query_params.get('id', None)
        sensor_type = self.request.query_params.get('sensor_type', None)
        channel = self.request.query_params.get('channel', None)
        arduino = self.request.query_params.get('arduino', None)
        machine_id = self.request.query_params.get('machine_id', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = custom_models.Sensor.objects.filter(
                machine__company__user=self.request.user)
        else:
            queryset = custom_models.Sensor.objects.all()
        if id is not None:
            queryset = queryset.filter(id=id)
        if sensor_type is not None:
            queryset = queryset.filter(sensor_type=sensor_type)
        if channel is not None:
            queryset = queryset.filter(channel=channel)
        if arduino is not None:
            queryset = queryset.filter(arduino=arduino)
        if machine_id is not None:
            queryset = queryset.filter(machine__id=machine_id)
        return queryset


class GearView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.GearSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url. For non staff/superusers,
        gears are always filtered by user to prevent users from 
        seeing unauthorized data.
        """

        id = self.request.query_params.get('gear_id', None)
        machine_id = self.request.query_params.get('machine_id', None)
        gear_type = self.request.query_params.get('gear_type', None)
        support = self.request.query_params.get('support', None)
        transmission = self.request.query_params.get('transmission', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = custom_models.Gear.objects.filter(
                machine__company__user=self.request.user)
        else:
            queryset = custom_models.Gear.objects.all()
        if id is not None:
            queryset = queryset.filter(id=id)
        if machine_id is not None:
            queryset = queryset.filter(machine__id=machine_id)
        if gear_type is not None:
            queryset = queryset.filter(gear_type=gear_type)
        if support is not None:
            queryset = queryset.filter(support=support)
        if transmission is not None:
            queryset = queryset.filter(transmission=transmission)
        return queryset


class AxisView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.AxisSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url. For non staff/superusers,
        axis are always filtered by user to prevent users from 
        seeing unauthorized data.
        """

        id = self.request.query_params.get('id', None)
        gear_id = self.request.query_params.get('gear_id', None)
        type_axis = self.request.query_params.get('type_axis', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = custom_models.Axis.objects.filter(
                gear__machine__company__user=self.request.user)
        else:
            queryset = custom_models.Axis.objects.all()
        if id is not None:
            queryset = queryset.filter(id=id)
        if gear_id is not None:
            queryset = queryset.filter(gear__id=gear_id)
        if type_axis is not None:
            queryset = queryset.filter(type_axis=type_axis)
        return queryset


class BearingView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.BearingSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url. For non staff/superusers,
        bearings are always filtered by user to prevent users from 
        seeing unauthorized data.
        """

        id = self.request.query_params.get('id', None)
        reference = self.request.query_params.get('reference', None)
        frequency = self.request.query_params.get('frequency', None)
        axis_id = self.request.query_params.get('axis_id', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = custom_models.Bearing.objects.filter(
                axis__gear__machine__company__user=self.request.user)
        else:
            queryset = custom_models.Bearing.objects.all()
        if id is not None:
            queryset = queryset.filter(id=id)
        if reference is not None:
            queryset = queryset.filter(reference=reference)
        if frequency is not None:
            queryset = queryset.filter(frequency=frequency)
        if axis_id is not None:
            queryset = queryset.filter(axis__id=axis_id)
        return queryset


class CouplingView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.CouplingSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):
        pass


class ImageView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.ImageSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url. For non staff/superusers,
        images are always filtered by user to prevent users from 
        seeing unauthorized data.
        """

        image_id = self.request.query_params.get('id', None)
        machine = self.request.query_params.get('machine', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = custom_models.Image.objects.filter(
                machine__company__user=self.request.user)
        else:
            queryset = custom_models.Image.objects.all()
        if image_id is not None:
            queryset = queryset.filter(id=image_id)
        if machine is not None:
            queryset = queryset.filter(machine__id=machine)
        return queryset


class DateView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.DateSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url. For non staff/superusers,
        dates are always filtered by user to prevent users from 
        seeing unauthorized data.
        """

        date_id = self.request.query_params.get('id', None)
        company = self.request.query_params.get('company', None)
        date = self.request.query_params.get('date', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = custom_models.Date.objects.filter(
                company__user=self.request.user)
        else:
            queryset = custom_models.Date.objects.all()
        if date_id is not None:
            queryset = queryset.filter(id=date_id)
        if company is not None:
            queryset = queryset.filter(company__id=company)
        if date is not None:
            queryset = queryset.filter(date=date)
        return queryset


class MeasurementView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.MeasurementSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url. For non staff/superusers,
        measurements are always filtered by user to prevent users from 
        seeing unauthorized data.
        """

        measurement_id = self.request.query_params.get('id', None)
        service = self.request.query_params.get('service', None)
        measurement_type = self.request.query_params.get(
            'measurement_type', None)
        machine = self.request.query_params.get('machine', None)
        date = self.request.query_params.get('date', None)
        severity = self.request.query_params.get('severity', None)
        engineer_one = self.request.query_params.get('engineer_one', None)
        engineer_two = self.request.query_params.get('engineer_two', None)
        analyst = self.request.query_params.get('analyst', None)
        certifier = self.request.query_params.get('certifier', None)
        revised = self.request.query_params.get('revised', None)
        resolved = self.request.query_params.get('resolved', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = custom_models.Measurement.objects.filter(
                machine__company__user=self.request.user)
        else:
            queryset = custom_models.Measurement.objects.all()
        if measurement_id is not None:
            queryset = queryset.filter(id=measurement_id)
        if service is not None:
            queryset = queryset.filter(service=service)
        if measurement_type is not None:
            queryset = queryset.filter(measurement_type=measurement_type)
        if machine is not None:
            queryset = queryset.filter(machine__id=machine)
        if date is not None:
            queryset = queryset.filter(date__id=date)
        if severity is not None:
            queryset = queryset.filter(severity=severity)
        if engineer_one is not None:
            queryset = queryset.filter(engineer_one__id=engineer_one)
        if engineer_two is not None:
            queryset = queryset.filter(engineer_two__id=engineer_two)
        if analyst is not None:
            queryset = queryset.filter(analyst=analyst)
        if certifier is not None:
            queryset = queryset.filter(certifier=certifier)
        if revised is not None:
            queryset = queryset.filter(revised=revised)
        if resolved is not None:
            queryset = queryset.filter(resolved=resolved)
        return queryset


class FlawView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.FlawSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url. For non staff/superusers,
        flaws are always filtered by user to prevent users from 
        seeing unauthorized data.
        """

        id = self.request.query_params.get('id', None)
        measurement_id = self.request.query_params.get('measurement_id', None)
        flaw_type = self.request.query_params.get('flaw_type', None)
        severity = self.request.query_params.get('severity', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = custom_models.Flaw.objects.filter(
                machine__company__user=self.request.user)
        else:
            queryset = custom_models.Flaw.objects.all()
        if id is not None:
            queryset = queryset.filter(id=id)
        if measurement_id is not None:
            queryset = queryset.filter(measurement__id=measurement_id)
        if flaw_type is not None:
            queryset = queryset.filter(flaw_type=flaw_type)
        if severity is not None:
            queryset = queryset.filter(severity=severity)
        return queryset


# TODO
class ReportView(viewsets.ModelViewSet):

    permission_classes = [CanGenerateReport]

    @staticmethod
    def get_email_data(user):
        return {
            'subject': 'SOLICITUD INFORME PREDICTIVO',
            'template': 'email/pred.html',
            'variables': {
                'user': user.username,
            }
        }

    def get(self, request):

        company = request.query_params.get('company', None)
        date = request.query_params.get('date', None)

        user = request.user
        if user.is_staff or user.is_superuser:
            if company is None:
                raise ValidationError('field company must be provided')
            queryset = custom_models.Measurement.filter(
                company__id=company)
        else:
            queryset = custom_models.Measurement.filter(
                machine__company__user=user)
        if date is not None:
            queryset = queryset.filter(date__id=date)
        else:
            raise ValidationError('field date must be provided')
        queryset = queryset.order_by('machine__machine_type')
        if not queryset.exists():
            raise NotFound("Reporte no encontrado")

        user = self.request.user
        data = self.get_email_data(user)
        send_email.delay(data, user, queryset=queryset, date=date)
        return Response(status=status.HTTP_200_OK)


class TermoImageView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.TermoImageSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url. For non staff/superusers,
        termal images are always filtered by user to prevent users from 
        seeing unauthorized data.
        """

        termo_iamge_id = self.request.query_params.get('id', None)
        measurement = self.request.query_params.get('measurement', None)
        image_type = self.request.query_params.get('image_type', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = custom_models.TermoImage.objects.filter(
                measurement__machine__company__user=self.request.user)
        else:
            queryset = custom_models.TermoImage.objects.all()
        if termo_iamge_id is not None:
            queryset = queryset.filter(id=termo_iamge_id)
        if measurement is not None:
            queryset = queryset.filter(measurement__id=measurement)
        if image_type is not None:
            queryset = queryset.filter(image_type=image_type)
        return queryset


class PointView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.PointSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url. For non staff/superusers,
        points are always filtered by user to prevent users from 
        seeing unauthorized data.
        """

        point_id = self.request.query_params.get('id', None)
        position = self.request.query_params.get('number', None)
        direction = self.request.query_params.get('position', None)
        point_type = self.request.query_params.get('point_type', None)
        measurement = self.request.query_params.get('measurement', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = custom_models.Point.objects.filter(
                measurement__machine__company__user=self.request.user)
        else:
            queryset = custom_models.Point.objects.all()
        if point_id is not None:
            queryset = queryset.filter(id=point_id)
        if position is not None:
            queryset = queryset.filter(position=position)
        if direction is not None:
            queryset = queryset.filter(direction=direction)
        if point_type is not None:
            queryset = queryset.filter(point_typed=point_type)
        if measurement is not None:
            queryset = queryset.filter(measurement__id=measurement)
        return queryset
