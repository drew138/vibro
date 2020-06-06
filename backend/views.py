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
    

class CompanyView(viewsets.ModelViewSet):

    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
   

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
        if company is not None:
             queryset = queryset.filter(company=company)
        if identifier is not None:
            queryset = queryset.filter(identifier=identifier)
        if name is not None:
            queryset = queryset.filter(name=identifier)
        if machine_type is not None:
            queryset = queryset.filter(machine_type=identifier)
        if q_id is not None:
            queryset = queryset.filter(id=q_id)
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
            queryset = queryset.filter(machine=machine)
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
            queryset = queryset.filter(machine=machine)
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
            queryset = queryset.filter(measurement=measurement)
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
            q_objects_point = Q()
            for me in measurements:
                q_objects_point |= Q(measurement=me)
            queryset = Point.objects.filter(q_objects_point).all()
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
            queryset = queryset.filter(measurement=measurement)
        return queryset


#TODO finish the following views
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

        pass


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

        pass

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

        pass