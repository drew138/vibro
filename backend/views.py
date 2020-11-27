from rest_framework.exceptions import ValidationError, NotAuthenticated, NotFound
from .permissions import IsStaffOrSuperUser, UpdatePass, ReportPermissions
from rest_framework import viewsets, generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from . import serializers as custom_serializers
from rest_framework.response import Response
from . import models as custom_models
from django.http import FileResponse
from rest_framework import status
from .report.report import Report
from io import BytesIO
import jwt
from django.contrib.auth.password_validation import validate_password


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
            return queryset
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

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = custom_serializers.VibroUserSerializer

    def get_object(self):
        return self.request.user


# Register API
class RegisterAPI(generics.GenericAPIView):

    serializer_class = custom_serializers.RegisterVibroUserSerializer

    @staticmethod
    def define_email(user):
        return {
            'subject': 'Bienvenido! - Vibromontajes',
            'template': 'email/welcome.html',
            'variables': {
                'user': user.first_name,
            },
            'receiver': [user.email]
        }

    @staticmethod
    def define_internal_email(user):
        staff_users = [vibrouser.email for vibrouser in custom_models.VibroUser.objects.filter(
            is_staff=True).all()]
        return {
            'subject': 'ACTIVACIÓN DE CUENTA - NUEVO USUARIO',
            'template': 'email/new_user.html',
            'variables': {
                'user': user.first_name,
            },
            'receiver': staff_users
        }

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # user.send_email(self.define_email(user)) #! remove comment
        # user.send_email(user)  # send email to staff #! do we want to allow users to assign a company for themselves?
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
    def define_email(request, user, refresh):
        return {
            'subject': 'Cambio de Contraseña - Vibromontajes',
            'template': 'email/password_reset.html',
            'variables': {
                'user': user.first_name,
                'host': request.get_host(),
                'username': user.username,
                'token': str(refresh.access_token)
            },
            'receiver': [user.email]
        }

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = custom_models.VibroUser.objects.filter(
            email=request.data['email']).first()
        if user.exists():
            refresh = RefreshToken.for_user(user)
            user.send_email(request, user, refresh)
        else:
            raise NotFound('usuario no encontrado')
        return Response({"detail": f"un correo de recuperacion ha sido enviado a la cuenta {user.blur_email()}"})


# Change Password API
class ChangePassAPI(generics.UpdateAPIView):

    permission_classes = [
        permissions.IsAuthenticated & UpdatePass
    ]

    serializer_class = custom_serializers.ChangePassSerializer

    @staticmethod
    def define_email(user):
        return {
            'subject': 'Cambio de Contraseña - Vibromontajes',
            'template': 'email/successful_change.html',
            'variables': {
                'user': user.username,
            },
            'receiver': [user.email]
        }

    def update(self, request, *args, **kwargs):
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
            # user.send_email(self.define_email(user))
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
        return self.request.user


class ForgotPassAPI(generics.UpdateAPIView):

    permission_classes = [
        permissions.IsAuthenticated & UpdatePass
    ]

    serializer_class = custom_serializers.ForgotPassSeriazliaer

    @staticmethod
    def define_email(user):
        return {
            'subject': 'Cambio de Contraseña - Vibromontajes',
            'template': 'email/successful_change.html',
            'variables': {
                'user': user.username,
            },
            'receiver': [user.email]
        }

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = self.get_object()
            try:
                validate_password(serializer.data.get("new_password"))
            except Exception as e:
                return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get("password"))
            user.save()
            # user.send_email(self.define_email(user))
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
            queryset = self.request.user.profile.first()
            return queryset
        else:
            queryset = custom_models.Profile.objects.all()
        if name is not None:
            queryset = queryset.filter(name=name)
        if profile_id is not None:
            queryset = queryset.filter(id=profile_id)
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

        machine_id = self.request.query_params.get('id', None)
        identifier = self.request.query_params.get('identifier', None)
        name = self.request.query_params.get('name', None)
        machine_type = self.request.query_params.get('machine_type', None)
        code = self.request.query_params.get('code', None)
        transmission = self.request.query_params.get('transmission', None)
        brand = self.request.query_params.get('brand', None)
        power = self.request.query_params.get('power', None)
        rpm = self.request.query_params.get('rpm', None)
        company = self.request.query_params.get('company', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = custom_models.Machine.filter(
                company__user=self.request.user)
        else:
            queryset = custom_models.Machine.objects.all()
        if machine_id is not None:
            queryset = queryset.filter(id=machine_id)
        if identifier is not None:
            queryset = queryset.filter(identifier=identifier)
        if name is not None:
            queryset = queryset.filter(name=identifier)
        if machine_type is not None:
            queryset = queryset.filter(machine_type=identifier)
        if code is not None:
            queryset = queryset.filter(code=code)
        if transmission is not None:
            queryset = queryset.filter(transmission=transmission)
        if brand is not None:
            queryset = queryset.filter(brand=brand)
        if power is not None:
            queryset = queryset.filter(power=power)
        if rpm is not None:
            queryset = queryset.filter(rpm=rpm)
        if company is not None:
            queryset = queryset.filter(company__id=company)
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
        company is always filtered in order to prevent them from seeing
        unauthorized data.
        """

        date_id = self.request.query_params.get('id', None)
        company = self.request.query_params.get('company', None)
        date = self.request.query_params.get('date', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = custom_models.Date.filter(
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
        measurement_type = self.request.query_params.get(
            'measurement_type', None)
        machine = self.request.query_params.get('machine', None)
        engineer_one = self.request.query_params.get('engineer_one', None)
        engineer_two = self.request.query_params.get('engineer_two', None)
        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = custom_models.Measurement.filter(
                machine__company__user=self.request.user)
        else:
            queryset = custom_models.Measurement.objects.all()
        if measurement_id is not None:
            queryset = queryset.filter(id=measurement_id)
        if severity is not None:
            queryset = queryset.filter(severity=severity)
        if date is not None:
            queryset = queryset.filter(date__id=date)
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


# TODO
class ReportView(viewsets.ModelViewSet):

    permission_classes = [ReportPermissions]

    @staticmethod
    def define_email(user, buffer, filename):
        return {
            'subject': 'SOLICITUD INFORME PREDICTIVO',
            'template': 'email/pred.html',
            'variables': {
                'user': user.username,
            },
            # cambiar a user
            'receiver': [user.email],
            'file': buffer,
            'filename': filename
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
        if queryset.exists():
            return Response({"Error": "Reporte No Encontrado"}, status=status.HTTP_404_NOT_FOUND)
        buffer = BytesIO()
        pdf = Report(buffer, queryset, user)
        pdf.build_doc()
        buffer.seek(0)
        filename = f'INFORME_PREDICTIVO_{company.upper()}_{date}.pdf'
        self.request.user.send_email(user, buffer, filename)  # cambiar a user
        return FileResponse(
            buffer,
            as_attachment=True,
            filename=f'INFORME_PREDICTIVO_{company.upper()}.pdf')


# class MockReport(generics.GenericAPIView):

#     permission_classes = [ReportPermissions]

#     def get(self, request, format=None):
#         from datetime import datetime
#         now = datetime.now()
#         user = custom_models.VibroUser.objects.filter(
#             username='juliana').first()
#         admin = custom_models.VibroUser.objects.filter(
#             username='drew').first()

#         queryset = custom_models.Measurement.objects.filter(severity='green')
#         buffer = BytesIO()
#         pdf = Report(buffer, queryset, user).build_doc()
#         buffer.seek(0)
#         filename = f'INFORME_PREDICTIVO_empresa.pdf'
#         pred_mail = {
#             'subject': 'SOLICITUD INFORME PREDICTIVO',
#             'template': 'email/pred.html',
#             'variables': {
#                 'user': user.username,
#             },
#             # cambiar a user
#             'receiver': ['proyectos@vibromontajes.com'],
#             'file': buffer,
#             'filename': filename
#         }
#         user.send_email(pred_mail)  # cambiar a user
#         return FileResponse(buffer, as_attachment=True, filename=filename)


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
            queryset = custom_models.TermoImage.objects.filter(
                measurement__machine__company__user=self.request.user)
        else:
            queryset = custom_models.TermoImage.objects.all()
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
            queryset = custom_models.Point.objects.filter(
                measurement__machine__company__user=self.request.user)
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
