from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from knox.models import AuthToken
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
            queryset = self.request.user.company.machines
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
        company is always filtered in order to prevent them from seeing
        unauthorized data.
        """

        machinne = self.request.query_params.get('machinne', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = self.request.user.company.machines.images
        else:
            queryset = Image.objects.all()
        if machinne is not None:
            queryset = queryset.filter(machinne=machinne)
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

        severity = self.request.query_params.get('severity', None)
        date = self.request.query_params.get('date', None)
        analysis = self.request.query_params.get('analysis', None)
        recomendation = self.request.query_params.get('recomendation', None)
        revised = self.request.query_params.get('revised', None)
        resolved = self.request.query_params.get('resolved', None)
        measurement_type = self.request.query_params.get('measurement_type', None)
        machine = self.request.query_params.get('machine', None)

        if not (self.request.user.is_staff or self.request.user.is_superuser):
            queryset = self.request.user.company.machines.measurements
        else:
            queryset = Image.objects.all()
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
        

#TODO finish the following views
class TermoImageView(viewsets.ModelViewSet):

    serializer_class = TermoImageSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]


class PointView(viewsets.ModelViewSet):

    serializer_class = PointSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]


class TendencyView(viewsets.ModelViewSet):

    serializer_class = TendencySerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]


class EspectraView(viewsets.ModelViewSet):

    serializer_class = EspectraSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]


class TimeSignalView(viewsets.ModelViewSet):

    serializer_class = TimeSignalSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]