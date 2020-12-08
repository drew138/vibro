from django.db.models import query
from . import permissions as custom_permissions
from . import serializers as custom_serializers
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from . import models as custom_models
from rest_framework import viewsets
from rest_framework import status
from .tasks import Email


class CityView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.CitySerializer
    permission_classes = [custom_permissions.CanReadOrIsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields on the City table
        based on url parameter.
        """

        id = self.request.query_params.get('id', None)
        name = self.request.query_params.get('name', None)
        state = self.request.query_params.get('state', None)
        queryset = custom_models.City.objects.all()
        if id:
            queryset = queryset.filter(id=id)
        if name:
            queryset = queryset.filter(name=name)
        if state:
            queryset = queryset.filter(state=state)
        return queryset


class CompanyView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.DefaultCompanySerializer
    permission_classes = [custom_permissions.CanReadOrIsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on params. For non staff/superusers,
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
        if id:
            queryset = queryset.filter(id=id)
        if name:
            queryset = queryset.filter(name=name)
        if nit:
            queryset = queryset.filter(nit=nit)
        if address:
            queryset = queryset.filter(address=address)
        if rut_address:
            queryset = queryset.filter(rut_address=rut_address)
        if pbx:
            queryset = queryset.filter(pbx=pbx)
        if city_id:
            queryset = queryset.filter(city__id=city_id)
        if rut_city_id:
            queryset = queryset.filter(rut_city__id=rut_city_id)
        return queryset

    def get_serializer_class(self):
        if self.action in {'list', 'retrieve'}:
            return custom_serializers.GetCompanySerializer
        return custom_serializers.DefaultCompanySerializer


class MachineView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.MachineSerializer
    permission_classes = [custom_permissions.CanReadOrIsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url params. For non staff/superusers,
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
        if id:
            queryset = queryset.filter(id=id)
        if identifier:
            queryset = queryset.filter(identifier=identifier)
        if company_id:
            queryset = queryset.filter(company__id=company_id)
        if name:
            queryset = queryset.filter(name=name)
        if code:
            queryset = queryset.filter(code=code)
        if electric_feed:
            queryset = queryset.filter(electric_feed=electric_feed)
        if transmission:
            queryset = queryset.filter(transmission=transmission)
        if brand:
            queryset = queryset.filter(brand=brand)
        if power:
            queryset = queryset.filter(power=power)
        if power_units:
            queryset = queryset.filter(power_units=power_units)
        if norm:
            queryset = queryset.filter(norm=norm)
        if hierarchy:
            queryset = queryset.filter(hierarchy=hierarchy)
        if rpm:
            queryset = queryset.filter(rpm=rpm)
        return queryset


class SensorView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.SensorSerializer
    permission_classes = [custom_permissions.CanReadOrIsStaffOrSuperUser]

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
        if id:
            queryset = queryset.filter(id=id)
        if sensor_type:
            queryset = queryset.filter(sensor_type=sensor_type)
        if channel:
            queryset = queryset.filter(channel=channel)
        if arduino:
            queryset = queryset.filter(arduino=arduino)
        if machine_id:
            queryset = queryset.filter(machine__id=machine_id)
        return queryset


class GearView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.GearSerializer
    permission_classes = [custom_permissions.CanReadOrIsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url params. For non staff/superusers,
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
        if id:
            queryset = queryset.filter(id=id)
        if machine_id:
            queryset = queryset.filter(machine__id=machine_id)
        if gear_type:
            queryset = queryset.filter(gear_type=gear_type)
        if support:
            queryset = queryset.filter(support=support)
        if transmission:
            queryset = queryset.filter(transmission=transmission)
        return queryset


class AxisView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.AxisSerializer
    permission_classes = [custom_permissions.CanReadOrIsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url params. For non staff/superusers,
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
        if id:
            queryset = queryset.filter(id=id)
        if gear_id:
            queryset = queryset.filter(gear__id=gear_id)
        if type_axis:
            queryset = queryset.filter(type_axis=type_axis)
        return queryset


class BearingView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.BearingSerializer
    permission_classes = [custom_permissions.CanReadOrIsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url params. For non staff/superusers,
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
        if id:
            queryset = queryset.filter(id=id)
        if reference:
            queryset = queryset.filter(reference=reference)
        if frequency:
            queryset = queryset.filter(frequency=frequency)
        if axis_id:
            queryset = queryset.filter(axis__id=axis_id)
        return queryset


class CouplingView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.CouplingSerializer
    permission_classes = [custom_permissions.CanReadOrIsStaffOrSuperUser]

    def get_queryset(self):
        pass


class ImageView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.ImageSerializer
    permission_classes = [custom_permissions.CanReadOrIsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url params. For non staff/superusers,
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
        if image_id:
            queryset = queryset.filter(id=image_id)
        if machine:
            queryset = queryset.filter(machine__id=machine)
        return queryset


class DateView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.DateSerializer
    permission_classes = [custom_permissions.CanReadOrIsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url params. For non staff/superusers,
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
        if date_id:
            queryset = queryset.filter(id=date_id)
        if company:
            queryset = queryset.filter(company__id=company)
        if date:
            queryset = queryset.filter(date=date)
        return queryset


class MeasurementView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.MeasurementSerializer
    permission_classes = [custom_permissions.CanReadOrIsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url params. For non staff/superusers,
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
        if measurement_id:
            queryset = queryset.filter(id=measurement_id)
        if service:
            queryset = queryset.filter(service=service)
        if measurement_type:
            queryset = queryset.filter(measurement_type=measurement_type)
        if machine:
            queryset = queryset.filter(machine__id=machine)
        if date:
            queryset = queryset.filter(date__id=date)
        if severity:
            queryset = queryset.filter(severity=severity)
        if engineer_one:
            queryset = queryset.filter(engineer_one__id=engineer_one)
        if engineer_two:
            queryset = queryset.filter(engineer_two__id=engineer_two)
        if analyst:
            queryset = queryset.filter(analyst=analyst)
        if certifier:
            queryset = queryset.filter(certifier=certifier)
        if revised:
            queryset = queryset.filter(revised=revised)
        if resolved:
            queryset = queryset.filter(resolved=resolved)
        return queryset


class FlawView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.FlawSerializer
    permission_classes = [custom_permissions.CanReadOrIsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url params. For non staff/superusers,
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
        if id:
            queryset = queryset.filter(id=id)
        if measurement_id:
            queryset = queryset.filter(measurement__id=measurement_id)
        if flaw_type:
            queryset = queryset.filter(flaw_type=flaw_type)
        if severity:
            queryset = queryset.filter(severity=severity)
        return queryset


class ReportView(viewsets.ModelViewSet):

    permission_classes = [custom_permissions.CanGenerateReport]

    def get(self, request):

        id = request.query_params.get('id', None)
        user = request.user

        queryset = custom_models.Measurement.objects.all()
        if not (user.is_staff or user.is_superuser):
            queryset = queryset.filter(
                machine__company__user=user)
        queryset = queryset.filter(id=id)
        # ! TODO add additional constraints to ordering
        queryset = queryset.order_by(['machine__hierarchy'])
        if not queryset.exists():
            raise NotFound("Reporte no encontrado")
        Email.report(request, queryset).delay()
        return Response(status=status.HTTP_200_OK)


class TermoImageView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.TermoImageSerializer
    permission_classes = [custom_permissions.CanReadOrIsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url params. For non staff/superusers,
        termal images are always filtered by user to prevent users from
        seeing unauthorized data.
        """

        id = self.request.query_params.get('id', None)
        measurement = self.request.query_params.get('measurement', None)
        image_type = self.request.query_params.get('image_type', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = custom_models.TermoImage.objects.filter(
                measurement__machine__company__user=self.request.user)
        else:
            queryset = custom_models.TermoImage.objects.all()
        if id:
            queryset = queryset.filter(id=id)
        if measurement:
            queryset = queryset.filter(measurement__id=measurement)
        if image_type:
            queryset = queryset.filter(image_type=image_type)
        return queryset


class PointView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.PointSerializer
    permission_classes = [custom_permissions.CanReadOrIsStaffOrSuperUser]

    def get_queryset(self):
        """
        Optionally filter fields based on url params. For non staff/superusers,
        points are always filtered by user to prevent users from
        seeing unauthorized data.
        """

        id = self.request.query_params.get('id', None)
        position = self.request.query_params.get('position', None)
        direction = self.request.query_params.get('direction', None)
        point_type = self.request.query_params.get('point_type', None)
        measurement = self.request.query_params.get('measurement', None)

        if self.request.user.is_staff or self.request.user.is_superuser:
            queryset = custom_models.Point.objects.all()
        else:
            queryset = custom_models.Point.objects.filter(
                measurement__machine__company__user=self.request.user)
        if id:
            queryset = queryset.filter(id=id)
        if position:
            queryset = queryset.filter(position=position)
        if direction:
            queryset = queryset.filter(direction=direction)
        if point_type:
            queryset = queryset.filter(point_type=point_type)
        if measurement:
            queryset = queryset.filter(measurement__id=measurement)
        return queryset
