from django.urls import path, include
from . import views
from rest_framework import routers
from .views import *
from knox import views as knox_views

auth_views = [
    path('auth', include('knox.urls')),
    path('auth/register', RegisterAPI.as_view()),
    path('auth/login', LoginAPI.as_view()),
    path('auth/user', UserAPI.as_view()),
    path('api/auth/logout', knox_views.LogoutView.as_view(), name='knox_logout')
]


router = routers.DefaultRouter()
# router.register('user', views.RegisterAPI, 'user')
# router.register('image', views.ImageView, 'image')



urlpatterns =  auth_views + router.urls 
