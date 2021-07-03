# from django.db.models import query
from . import permissions as custom_permissions
from . import serializers as custom_serializers
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from . import models as custom_models
from rest_framework import viewsets
from rest_framework import status
from .tasks import Email
from .user_groups import STAFF


class CityView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.CitySerializer
    permission_classes = [custom_permissions.GeneralPermission]

    def get_queryset(self):
        """
        Optionally filter fields on the City table
        based on url parameter.
        """

        name = self.request.query_params.get('name', None)
        state = self.request.query_params.get('state', None)
        queryset = custom_models.City.objects.all()
        if name:
            queryset = queryset.filter(name=name)
        if state:
            queryset = queryset.filter(state=state)
        return queryset


class CompanyView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.DefaultCompanySerializer
    permission_classes = [custom_permissions.GeneralPermission]

    def get_queryset(self):
        """
        Optionally filter fields based on params.
        For non staff/superusers, companies are
        always filtered by user to prevent users
        from seeing unauthorized data.
        """

        name = self.request.query_params.get('name', None)
        nit = self.request.query_params.get('nit', None)
        address = self.request.query_params.get('address', None)
        phone = self.request.query_params.get('phone', None)
        city = self.request.query_params.get('city', None)

        if self.request.user.user_type in STAFF:
            queryset = custom_models.Company.objects.all()
        else:
            if self.request.user.company:
                queryset = custom_models.Company.objects.filter(
                    id=self.request.user.company.id)
            else:
                queryset = custom_models.Company.objects.filter(
                    id=0)
        if name:
            queryset = queryset.filter(name=name)
        if nit:
            queryset = queryset.filter(nit=nit)
        if address:
            queryset = queryset.filter(address=address)
        if phone:
            queryset = queryset.filter(phone=phone)
        if city:
            queryset = queryset.filter(city__id=city)
        return queryset

    def get_serializer_class(self):
        if self.action in {'list', 'retrieve'}:
            return custom_serializers.GetCompanySerializer
        return custom_serializers.DefaultCompanySerializer


class HierarchyView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.HierarchySerializer
    permission_classes = [custom_permissions.GeneralPermission]

    def get_queryset(self):

        company_id = self.request.query_params.get('company_id', None)

        if self.request.user.user_type in STAFF:
            queryset = custom_models.Hierarchy.objects.all()
        else:
            queryset = custom_models.Hierarchy.objects.filter(
                company__user=self.request.user)
            return queryset
        if company_id:
            queryset = queryset.filter(company__id=company_id)
        return queryset

    def get_serializer_class(self):
        if self.action in {'list', 'retrieve'}:
            return custom_serializers.ListHierarchySerializer
        return custom_serializers.HierarchySerializer


class MachineView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.MachineSerializer
    permission_classes = [custom_permissions.GeneralPermission]

    def get_queryset(self):
        """
        Optionally filter fields based on url
        params. For non staff/superusers, machines
        are always filtered by user to prevent
        users from seeing unauthorized data.
        """

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

        if self.request.user.user_type in STAFF:
            queryset = custom_models.Machine.objects.all()
        else:
            queryset = custom_models.Machine.objects.filter(
                company__user=self.request.user)
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
    permission_classes = [custom_permissions.GeneralPermission]

    def get_queryset(self):
        """
        Optionally filter fields based on url parameters. For non
        staff/superusers, sensors are always filtered by user
        to prevent users from seeing unauthorized data.
        """

        sensor_type = self.request.query_params.get('sensor_type', None)
        channel = self.request.query_params.get('channel', None)
        arduino = self.request.query_params.get('arduino', None)
        machine_id = self.request.query_params.get('machine_id', None)

        if self.request.user.user_type in STAFF:
            queryset = custom_models.Sensor.objects.all()
        else:
            queryset = custom_models.Sensor.objects.filter(
                machine__company__user=self.request.user)
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
    permission_classes = [custom_permissions.GeneralPermission]

    def get_queryset(self):
        """
        Optionally filter fields based on url params. 
        For non staff/superusers, gears are always 
        filtered by user to prevent users from
        seeing unauthorized data.
        """

        machine_id = self.request.query_params.get('machine_id', None)
        gear_type = self.request.query_params.get('gear_type', None)
        support = self.request.query_params.get('support', None)
        transmission = self.request.query_params.get('transmission', None)

        if self.request.user.user_type in STAFF:
            queryset = custom_models.Gear.objects.all()
        else:
            queryset = custom_models.Gear.objects.filter(
                machine__company__user=self.request.user)
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
    permission_classes = [custom_permissions.GeneralPermission]

    def get_queryset(self):
        """
        Optionally filter fields based on url
        params. For non staff/superusers, axis
        are always filtered by user to prevent
        users from seeing unauthorized data.
        """

        gear_id = self.request.query_params.get('gear_id', None)
        type_axis = self.request.query_params.get('type_axis', None)

        if self.request.user.user_type in STAFF:
            queryset = custom_models.Axis.objects.all()
        else:
            queryset = custom_models.Axis.objects.filter(
                gear__machine__company__user=self.request.user)
        if gear_id:
            queryset = queryset.filter(gear__id=gear_id)
        if type_axis:
            queryset = queryset.filter(type_axis=type_axis)
        return queryset


class BearingView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.BearingSerializer
    permission_classes = [custom_permissions.GeneralPermission]

    def get_queryset(self):
        """
        Optionally filter fields based on
        url params. For non staff/superusers,
        bearings are always filtered by user
        to prevent users from seeing unauthorized
        data.
        """

        reference = self.request.query_params.get('reference', None)
        frequency = self.request.query_params.get('frequency', None)
        axis_id = self.request.query_params.get('axis_id', None)

        if self.request.user.user_type in STAFF:
            queryset = custom_models.Bearing.objects.all()
        else:
            queryset = custom_models.Bearing.objects.filter(
                axis__gear__machine__company__user=self.request.user)
        if reference:
            queryset = queryset.filter(reference=reference)
        if frequency:
            queryset = queryset.filter(frequency=frequency)
        if axis_id:
            queryset = queryset.filter(axis__id=axis_id)
        return queryset


class CouplingView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.CouplingSerializer
    permission_classes = [custom_permissions.GeneralPermission]

    def get_queryset(self):
        pass


class MeasurementView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.MeasurementSerializer
    permission_classes = [custom_permissions.GeneralPermission]

    def get_queryset(self):
        """
        Optionally filter fields based on url
        params. For non staff/superusers,
        measurements are always filtered by
        user to prevent users from seeing
        unauthorized data.
        """

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

        if self.request.user.user_type in STAFF:
            queryset = custom_models.Measurement.objects.all()
        else:
            queryset = custom_models.Measurement.objects.filter(
                machine__company__user=self.request.user)
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


class MeasurementDatesView(viewsets.ModelViewSet):

    permission_classes = [custom_permissions.IsGetRequest]

    def get(self, request):

        company_id = request.query_params.get('company_id', None)
        if not company_id:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        dates = custom_models.Measurement.objects.filter(
            machine__company__id=company_id).values_list("date", flat=True).distinct("date")
        dates = list(dates) if dates else []
        return Response({
            "dates": dates
        }, status=status.HTTP_200_OK)


# class FlawView(viewsets.ModelViewSet):

#     serializer_class = custom_serializers.FlawSerializer
#     permission_classes = [custom_permissions.GeneralPermission]

#     def get_queryset(self):
#         """
#         Optionally filter fields based on url
#         params. For non staff/superusers,
#         flaws are always filtered by user to
#         prevent users from seeing unauthorized
#         data.
#         """

#         measurement = self.request.query_params.get('measurement', None)
#         flaw_type = self.request.query_params.get('flaw_type', None)
#         severity = self.request.query_params.get('severity', None)

#         if self.request.user.user_type in STAFF:
#             queryset = custom_models.Flaw.objects.all()
#         else:
#             queryset = custom_models.Flaw.objects.filter(
#                 machine__company__user=self.request.user)
#         if measurement:
#             queryset = queryset.filter(measurement__id=measurement)
#         if flaw_type:
#             queryset = queryset.filter(flaw_type=flaw_type)
#         if severity:
#             queryset = queryset.filter(severity=severity)
#         return queryset


class ReportView(viewsets.ModelViewSet):

    permission_classes = [custom_permissions.IsGetRequest]

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
    permission_classes = [custom_permissions.GeneralPermission]

    def get_queryset(self):
        """
        Optionally filter fields based on url
        params. For non staff/superusers, termal
        images are always filtered by user to
        prevent users from seeing unauthorized
        data.
        """

        measurement = self.request.query_params.get('measurement', None)
        image_type = self.request.query_params.get('image_type', None)

        if self.request.user.user_type in STAFF:
            queryset = custom_models.TermoImage.objects.all()
        else:
            queryset = custom_models.TermoImage.objects.filter(
                measurement__machine__company__user=self.request.user)
        if measurement:
            queryset = queryset.filter(measurement__id=measurement)
        if image_type:
            queryset = queryset.filter(image_type=image_type)
        return queryset


class PointView(viewsets.ModelViewSet):

    serializer_class = custom_serializers.PointSerializer
    permission_classes = [custom_permissions.GeneralPermission]

    def get_queryset(self):
        """
        Optionally filter fields based on url
        params. For non staff/superusers, points
        are always filtered by user to prevent
        users from seeing unauthorized data.
        """

        position = self.request.query_params.get('position', None)
        direction = self.request.query_params.get('direction', None)
        point_type = self.request.query_params.get('point_type', None)
        measurement = self.request.query_params.get('measurement', None)

        if self.request.user.user_type in STAFF:
            queryset = custom_models.Point.objects.all()
        else:
            queryset = custom_models.Point.objects.filter(
                measurement__machine__company__user=self.request.user)
        if position:
            queryset = queryset.filter(position=position)
        if direction:
            queryset = queryset.filter(direction=direction)
        if point_type:
            queryset = queryset.filter(point_type=point_type)
        if measurement:
            queryset = queryset.filter(measurement__id=measurement)
        return queryset


class ValuesView(viewsets.ModelViewSet):

    def list(self, request):  # TODO index measurement by date

        machine = request.query_params.get('machine', None)
        measurement = request.query_params.get('measurement', None)
        date = request.query_params.get('date', None)

        previous_measurement_id = custom_models.Measurement.objects.filter(
            date__lt=date,
            service="predictivo",
            machine=machine).order_by("-date").values_list("id").first()[0]

        current = custom_models.Values.objects.all().filter(
            measurement__id=measurement)
        previous = custom_models.Values.objects.all().filter(
            measurement__machine=machine, measurement__id=previous_measurement_id)

        current_serializer = custom_serializers.ValuesSerializer(
            current, many=True)
        previous_serializer = custom_serializers.ValuesSerializer(
            previous, many=True)
        return Response({
            "current": current_serializer.data,
            "previous": previous_serializer.data
        })
