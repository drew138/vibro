from rest_framework.exceptions import ValidationError, NotAuthenticated, NotFound
from rest_framework import viewsets, generics, permissions
from .permissions import IsStaffOrSuperUser, UpdatePass
from django.template.loader import render_to_string
from . import serializers as custom_serializers
from v_website.settings import EMAIL_HOST_USER
from rest_framework.response import Response
from . import models as custom_models
from knox.models import AuthToken
from django.db.models import Q
from django.core.mail import EmailMessage
from django.conf import settings

def send_email(data):

    """
    function to be used in a view to send emails.
    """

    template = render_to_string(data['template'], data['variables'])
    sender = settings.EMAIL_HOST_USER
    email = EmailMessage(data['subject'], template, sender, data['receiver'])
    email.content_subtype = "html"
    email.fail_silently = False
    email.send()


class CityView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.CitySerializer
    permission_classes = [IsStaffOrSuperUser]
    
    def get_queryset(self):

        """
        Optionally filter fields based on url. For non staff/superusers,
        company is always filtered to prevent users them from seeing
        unauthorized data.
        """

        name = self.request.query_params.get('name', None)
        state = self.request.query_params.get('state', None)
        queryset = custom_models.City.objects.all()
        if name is not None:
            queryset = queryset.filter(name=name).all()
        if state is not None:
            queryset = queryset.filter(state=state).all()
        return queryset


class CompanyView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.CompanySerializer
    permission_classes = [IsStaffOrSuperUser]
   
    def get_queryset(self):

        """
        Optionally filter fields based on url. For non staff/superusers,
        company is always filtered to prevent users them from seeing
        unauthorized data.
        """

        name = self.request.query_params.get('name', None)
        nit = self.request.query_params.get('name', None)
        address = self.request.query_params.get('address', None)
        rut_address = self.request.query_params.get('rut_address', None)
        pbx = self.request.query_params.get('pbx', None)
        city = self.request.query_params.get('city', None)
        rut_city = self.request.query_params.get('rut_city', None)
        
        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = self.request.user.company
        else:
            queryset = custom_models.Company.objects.all()
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
        if city is not None:
            queryset = queryset.filter(city__id=city)
        if rut_city is not None:
            queryset = queryset.filter(rut_city__id=rut_city)
        return queryset


# Get User API
class UserAPI(generics.RetrieveAPIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = custom_serializers.VibroUserSerializer

    def get_object(self):
        return self.request.user


# Register API
class RegisterAPI(generics.GenericAPIView):

    serializer_class = custom_serializers.RegisterVibroUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        email_data = {
            'subject':'Bienvenido! - Vibromontajes',
            'template': 'email/welcome.html',
            'variables': {
                'user': user.first_name,
            },
            'receiver': [user.email]
        }
        send_email(email_data)  # send welcome email
        staff_users = [vibrouser.email for vibrouser in custom_models.VibroUser.objects.filter(is_staff=True).all()]
        staff_email = {
            'subject':'ACTIVACIÓN DE CUENTA - NUEVO USUARIO',
            'template': 'email/new_user.html',
            'variables': {
                'user': user.first_name,
            },
            'receiver': staff_users
        }
        send_email(staff_email)  # send email to staff
        return Response({
            "user": custom_serializers.RegisterVibroUserSerializer(user,
            context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


# Login API
class LoginAPI(generics.GenericAPIView):

    serializer_class = custom_serializers.LoginVibroUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": custom_serializers.VibroUserSerializer(user,
            context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


# Reset API
class ResetAPI(generics.GenericAPIView):
        
    serializer_class = custom_serializers.ResetSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = custom_models.VibroUser.objects.filter(email=request.data['email']).first()
        if user.exists():
            token = AuthToken.objects.create(user)[1]
            email_data = {
                'subject':'Cambio de Contraseña - Vibromontajes',
                'template': 'email/password_reset.html',
                'variables': {
                    'user': user.first_name,
                    'host': request.get_host(),
                    'username': user.username,
                    'token': token
                },
                'receiver': [user.email]
            }
            send_email(email_data)
        else:
            raise NotFound('user not found')
        return Response({"detail": f"an email has been sent to {user.email}" })


# Change Password API
class ChangePassAPI(generics.UpdateAPIView):

    permission_classes = [
        permissions.IsAuthenticated & UpdatePass
    ]

    serializer_class = custom_serializers.ChangePassSerializer

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.update(self.get_object(), request.data['password'])
        email_data = {
                'subject':'Cambio de Contraseña - Vibromontajes',
                'template': 'email/successful_change.html',
                'variables': {
                    'user': user.username,
                },
                'receiver': [user.email]
            }
        send_email(email_data)
        return Response({
            "user": custom_serializers.ChangePassSerializer(user,
            context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

    def get_object(self):
        return self.request.user


class ProfileView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.ProfileSerializer
    permission_classes = [IsStaffOrSuperUser]
    
    def get_queryset(self):

        """
        Optionally filter fields based on url. For non staff/superusers,
        company is always filtered to prevent users them from seeing
        unauthorized data.
        """

        profile_id = self.request.query_params.get('id', None)
        name = self.request.query_params.get('name', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = self.request.user.profile
        else:
            queryset = custom_models.Profile.objects.all()
        if name is not None:
            queryset = queryset.filter(name=name).all()
        if profile_id is not None:
            queryset = queryset.filter(id=profile_id).all()
        return queryset


class MachineView(viewsets.ModelViewSet):
    
    serializer_class = custom_serializers.MachineSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):

        """
        Optionally filter fields based on url. For non staff/superusers,
        company is always filtered in order to prevent them from seeing
        unauthorized data.
        """

        identifier = self.request.query_params.get('identifier', None)
        name = self.request.query_params.get('name', None)
        machine_type = self.request.query_params.get('machine_type', None)
        company = self.request.query_params.get('company', None)
        q_id = self.request.query_params.get('id', None)  # object id

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = self.request.user.company.machines.all()
        else:
            queryset = custom_models.Machine.objects.all()
        if q_id is not None:
            queryset = queryset.filter(id=q_id)
        if company is not None:
             queryset = queryset.filter(company__id=company)
        if identifier is not None:
            queryset = queryset.filter(identifier=identifier)
        if name is not None:
            queryset = queryset.filter(name=identifier)
        if machine_type is not None:
            queryset = queryset.filter(machine_type=identifier)
        return queryset
        

class ImageView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.ImageSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):

        """
        Optionally filter fields based on url. For non staff/superusers,
        company is always filtered to prevent users them from seeing
        unauthorized data.
        """

        image_id = self.request.query_params.get('id', None)
        machine = self.request.query_params.get('machine', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            q_objects = Q()
            for m in self.request.user.company.machines:
                q_objects |= Q(machine=m)
            queryset = custom_models.Image.objects.filter(q_objects).all()
        else:
            queryset = custom_models.Image.objects.all()
        if image_id is not None:
            queryset = queryset.filter(id=image_id)
        if machine is not None:
            queryset = queryset.filter(machine__id=machine)
        return queryset


class MeasurementView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.MeasurementSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):

        """
        Optionally filter fields based on url. For non staff/superusers,
        company is always filtered in order to prevent them from seeing
        unauthorized data.
        """

        measurement_id = self.request.query_params.get('id', None)
        severity = self.request.query_params.get('severity', None)
        date = self.request.query_params.get('date', None)
        analysis = self.request.query_params.get('analysis', None)
        recomendation = self.request.query_params.get('recomendation', None)
        revised = self.request.query_params.get('revised', None)
        resolved = self.request.query_params.get('resolved', None)
        measurement_type = self.request.query_params.get('measurement_type', None)
        machine = self.request.query_params.get('machine', None)
        engineer_one = self.request.query_params.get('engineer_one', None)
        engineer_two = self.request.query_params.get('engineer_two', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            q_objects = Q()
            for m in self.request.user.company.machines:
                q_objects |= Q(machine=m)
            queryset = custom_models.Measurement.objects.filter(q_objects).all()
        else:
            queryset = custom_models.Image.objects.all()
        if measurement_id is not None:
            queryset = queryset.filter(id=measurement_id)
        if severity is not None:
            queryset = queryset.filter(severity=severity)
        if date is not None:
            queryset = queryset.filter(date=date)  # requires further specification on date
        if analysis is not None:
            queryset = queryset.filter(analysis=analysis)
        if recomendation is not None:
            queryset = queryset.filter(recomendation=recomendation)
        if revised is not None:
            queryset = queryset.filter(revised=revised)
        if resolved is not None:
            queryset = queryset.filter(resolved=resolved)
        if measurement_type is not None:
            queryset = queryset.filter(measurement_type=measurement_type)
        if machine is not None:
            queryset = queryset.filter(machine__id=machine)
        if engineer_one is not None:
            queryset = queryset.filter(engineer_one__id=engineer_one)
        if engineer_two is not None:
            queryset = queryset.filter(engineer_two__id=engineer_two)
        return queryset
        

class TermoImageView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.TermoImageSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):

        """
        Optionally filter fields based on url. For non staff/superusers,
        company is always filtered to prevent users them from seeing
        unauthorized data.
        """

        termo_iamge_id = self.request.query_params.get('id', None)
        image_type = self.request.query_params.get('image_type', None)
        machine = self.request.query_params.get('machine', None)
        measurement = self.request.query_params.get('measurement', None)


        if not (self.request.user.is_staff or self.request.user.is_superuser):
            q_objects = Q()
            for m in self.request.user.company.machines:
                q_objects |= Q(machine=m)
            measurements = custom_models.Measurement.objects.filter(q_objects).all()
            q_objects_t_image = Q()
            for me in measurements:
                q_objects_t_image |= Q(measurement=me)
            queryset = custom_models.TermoImage.objects.filter(q_objects_t_image).all()
        else:
            queryset = custom_models.Image.objects.all()
        if termo_iamge_id is not None:
            queryset = queryset.filter(id=termo_iamge_id)
        if image_type is not None:
            queryset = queryset.filter(image_type=image_type)
        if machine is not None:
            queryset = queryset.filter(machine=machine)
        if measurement is not None:
            queryset = queryset.filter(measurement__id=measurement)
        return queryset


class PointView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.PointSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):

        """
        Optionally filter fields based on url. For non staff/superusers,
        company is always filtered to prevent users them from seeing
        unauthorized data.
        """

        point_id = self.request.query_params.get('id', None)
        number = self.request.query_params.get('number', None)
        position = self.request.query_params.get('position', None)
        point_type = self.request.query_params.get('point_type', None)
        measurement = self.request.query_params.get('measurement', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            q_objects = Q()
            for m in self.request.user.company.machines:
                q_objects |= Q(machine=m)
            measurements = custom_models.Measurement.objects.filter(q_objects).all()
            q_objects_measurement = Q()
            for me in measurements:
                q_objects_measurement |= Q(measurement=me)
            queryset = custom_models.Point.objects.filter(q_objects_measurement).all()
        else:
            queryset = custom_models.Point.objects.all()
        if point_id is not None:
            queryset = queryset.filter(id=point_id)
        if number is not None:
            queryset = queryset.filter(number=number)
        if position is not None:
            queryset = queryset.filter(position=position)
        if point_type is not None:
            queryset = queryset.filter(point_typed=point_type)
        if measurement is not None:
            queryset = queryset.filter(measurement__id=measurement)
        return queryset


class TendencyView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.TendencySerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):

        """
        Optionally filter fields based on url. For non staff/superusers,
        company is always filtered to prevent users them from seeing
        unauthorized data.
        """

        tendency_id = self.request.query_params.get('id', None)
        point = self.request.query_params.get('point', None)
        value = self.request.query_params.get('value', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            q_objects = Q()
            for m in self.request.user.company.machines:
                q_objects |= Q(machine=m)
            measurements = custom_models.Measurement.objects.filter(q_objects).all()
            q_objects_measurement = Q()
            for me in measurements:
                q_objects_measurement |= Q(measurement=me)
            points = custom_models.Point.objects.filter(q_objects_measurement).all()
            q_objects_point = Q()
            for p in points:
                q_objects_point |= Q(point=p)
            queryset = custom_models.Tendency.objects.filter(q_objects_point).all()
        else:
            queryset = custom_models.Tendency.objects.all()
        if tendency_id is not None:
            queryset = queryset.filter(id=tendency_id)
        if point is not None:
            queryset = queryset.filter(point__id=point)
        if value is not None:
            queryset = queryset.filter(value=value)
        return queryset


class EspectraView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.EspectraSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):

        """
        Optionally filter fields based on url. For non staff/superusers,
        company is always filtered to prevent users them from seeing
        unauthorized data.
        """

        espectra_id = self.request.query_params.get('id', None)
        identifier = self.request.query_params.get('identifier', None)
        point = self.request.query_params.get('point', None)
        value = self.request.query_params.get('value', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            q_objects = Q()
            for m in self.request.user.company.machines:
                q_objects |= Q(machine=m)
            measurements = custom_models.Measurement.objects.filter(q_objects).all()
            q_objects_measurement = Q()
            for me in measurements:
                q_objects_measurement |= Q(measurement=me)
            points = custom_models.Point.objects.filter(q_objects_measurement).all()
            q_objects_point = Q()
            for p in points:
                q_objects_point |= Q(point=p)
            queryset = custom_models.Espectra.objects.filter(q_objects_point).all()
        else:
            queryset = custom_models.Tendency.objects.all()
        if espectra_id is not None:
            queryset = queryset.filter(id=espectra_id)
        if identifier is not None:
            queryset = queryset.filter(identifier=identifier)
        if point is not None:
            queryset = queryset.filter(point__id=point)
        if value is not None:
            queryset = queryset.filter(value=value)
        return queryset


class TimeSignalView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.TimeSignalSerializer
    permission_classes = [IsStaffOrSuperUser]

    def get_queryset(self):

        """
        Optionally filter fields based on url. For non staff/superusers,
        company is always filtered to prevent users them from seeing
        unauthorized data.
        """

        signal_id = self.request.query_params.get('id', None)
        identifier = self.request.query_params.get('identifier', None)
        point = self.request.query_params.get('point', None)
        value = self.request.query_params.get('value', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            q_objects = Q()
            for m in self.request.user.company.machines:
                q_objects |= Q(machine=m)
            measurements = custom_models.Measurement.objects.filter(q_objects).all()
            q_objects_measurement = Q()
            for me in measurements:
                q_objects_measurement |= Q(measurement=me)
            points = custom_models.Point.objects.filter(q_objects_measurement).all()
            q_objects_point = Q()
            for p in points:
                q_objects_point |= Q(point=p)
            queryset = custom_models.TimeSignal.objects.filter(q_objects_point).all()
        else:
            queryset = custom_models.Tendency.objects.all()
        if signal_id is not None:
            queryset = queryset.filter(id=signal_id)
        if identifier is not None:
            queryset = queryset.filter(identifier=identifier)
        if point is not None:
            queryset = queryset.filter(point__id=point)
        if value is not None:
            queryset = queryset.filter(value=value)
        return queryset