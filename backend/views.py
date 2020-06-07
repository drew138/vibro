from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from knox.models import AuthToken
from django.db.models import Q
from .models import *
from .serializers import *
# from rest_framework import filters


class CityView(viewsets.ModelViewSet):

    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    
    def get_queryset(self):

        """
        Optionally filter fields based on url. For non staff/superusers,
        company is always filtered to prevent users them from seeing
        unauthorized data.
        """

        name = self.request.query_params.get('name', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = self.request.user.company.city
        else:
            queryset = City.objects.all()
        if name is not None:
            queryset.filter(name=name).all()
        return queryset


class CompanyView(viewsets.ModelViewSet):

    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
   
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
            queryset = Company.objects.all()
        if name is not None:
            queryset.filter(name=name)
        if nit is not None:
            queryset.filter(nit=nit)
        if address is not None:
            queryset.filter(address=address)
        if rut_address is not None:
            queryset.filter(rut_address=rut_address)
        if pbx is not None:
            queryset.filter(pbx=pbx)
        if city is not None:
            queryset.filter(city__id=city)
        if rut_city is not None:
            queryset.filter(rut_city__id=rut_city)
        return queryset


# Get User API
class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = VibroUserSerializer

    def get_object(self):
        return self.request.user


# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterVibroUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": VibroUserSerializer(user,
            context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


# Login API
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginVibroUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": VibroUserSerializer(user,
            context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        })


class MachineView(viewsets.ModelViewSet):
    
    serializer_class = VibroUserSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

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
            queryset = Machine.objects.all()
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

    serializer_class = ImageSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

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
            queryset = Image.objects.filter(q_objects).all()
        else:
            queryset = Image.objects.all()
        if image_id is not None:
            queryset = queryset.filter(id=image_id)
        if machine is not None:
            queryset = queryset.filter(machine__id=machine)
        return queryset


class MeasurementView(viewsets.ModelViewSet):

    serializer_class = MeasurementSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

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
            queryset = Measurement.objects.filter(q_objects).all()
        else:
            queryset = Image.objects.all()
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

    serializer_class = TermoImageSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

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
            measurements = Measurement.objects.filter(q_objects).all()
            q_objects_t_image = Q()
            for me in measurements:
                q_objects_t_image |= Q(measurement=me)
            queryset = TermoImage.objects.filter(q_objects_t_image).all()
        else:
            queryset = Image.objects.all()
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

    serializer_class = PointSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

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
            measurements = Measurement.objects.filter(q_objects).all()
            q_objects_measurement = Q()
            for me in measurements:
                q_objects_measurement |= Q(measurement=me)
            queryset = Point.objects.filter(q_objects_measurement).all()
        else:
            queryset = Point.objects.all()
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

    serializer_class = TendencySerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

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
            measurements = Measurement.objects.filter(q_objects).all()
            q_objects_measurement = Q()
            for me in measurements:
                q_objects_measurement |= Q(measurement=me)
            points = Point.objects.filter(q_objects_measurement).all()
            q_objects_point = Q()
            for p in points:
                q_objects_point |= Q(point=p)
            queryset = Tendency.objects.filter(q_objects_point).all()
        else:
            queryset = Tendency.objects.all()
        if tendency_id is not None:
            queryset = queryset.filter(id=tendency_id)
        if point is not None:
            queryset = queryset.filter(point__id=point)
        if value is not None:
            queryset = queryset.filter(value=value)
        return queryset


class EspectraView(viewsets.ModelViewSet):

    serializer_class = EspectraSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

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
            measurements = Measurement.objects.filter(q_objects).all()
            q_objects_measurement = Q()
            for me in measurements:
                q_objects_measurement |= Q(measurement=me)
            points = Point.objects.filter(q_objects_measurement).all()
            q_objects_point = Q()
            for p in points:
                q_objects_point |= Q(point=p)
            queryset = Espectra.objects.filter(q_objects_point).all()
        else:
            queryset = Tendency.objects.all()
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

    serializer_class = TimeSignalSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

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
            measurements = Measurement.objects.filter(q_objects).all()
            q_objects_measurement = Q()
            for me in measurements:
                q_objects_measurement |= Q(measurement=me)
            points = Point.objects.filter(q_objects_measurement).all()
            q_objects_point = Q()
            for p in points:
                q_objects_point |= Q(point=p)
            queryset = TimeSignal.objects.filter(q_objects_point).all()
        else:
            queryset = Tendency.objects.all()
        if signal_id is not None:
            queryset = queryset.filter(id=signal_id)
        if identifier is not None:
            queryset = queryset.filter(identifier=identifier)
        if point is not None:
            queryset = queryset.filter(point__id=point)
        if value is not None:
            queryset = queryset.filter(value=value)
        return queryset