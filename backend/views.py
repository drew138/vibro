from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from knox.models import AuthToken
from .models import *
from .serializers import *

# Register API
class ReisterAPI(generics.GenericAPIView):
    pass


# Login API


# Get User API

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
