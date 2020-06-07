from django.urls import path, include
from knox import views as knox_views
from rest_framework import routers
from . import views

auth_views = [
    path('auth', include('knox.urls')),
    path('auth/register', views.RegisterAPI.as_view()),
    path('auth/login', views.LoginAPI.as_view()),
    path('auth/user', views.UserAPI.as_view()),
    path('api/auth/logout', knox_views.LogoutView.as_view(), name='knox_logout')
]


router = routers.DefaultRouter()
router.register('city', views.CityView, 'city')
router.register('company', views.CompanyView, 'company')
router.register('machine', views.MachineView, 'machine')
router.register('image', views.ImageView, 'image')
router.register('measurement', views.MeasurementView, 'measurement')
router.register('termal', views.TermoImageView, 'termal')
router.register('point', views.PointView, 'point')
router.register('tendency', views.TendencyView, 'tendency')
router.register('espectra', views.EspectraView, 'espectra')
router.register('timesignal', views.TimeSignalView, 'timesignal')


urlpatterns =  auth_views + router.urls 
