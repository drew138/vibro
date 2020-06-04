from rest_framework import viewsets
from .models import City, Company, VibroUser, Machine, Image, Measurement, Point
from .serializers import CitySerializer, CitySerializer, VibroUserSerializer, MachineSerializer, ImageSerializer, MeasurementSerializer, PointSerializer
# from rest_framework import filters


class CityView(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer


class VibroUserView(viewsets.ModelViewSet):
    queryset = VibroUser.objects.all()
    serializer_class = VibroUserSerializer


# class ImageView(viewsets.ModelViewSet):
#     queryset = Image.objects.all()
#     serializer_class = ImageSerializer
