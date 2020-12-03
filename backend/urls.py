from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import routers
from django.urls import path
from . import views
from . import authentication_views


# TODO test endpoints
auth_views = [
    path('auth/user', authentication_views.UserAPI.as_view()),
    path('auth/register', authentication_views.RegisterAPI.as_view()),
    path('auth/register/admin', authentication_views.RegisterAdminAPI.as_view()),
    path('auth/reset', authentication_views.ResetAPI.as_view()),
    path('auth/change', authentication_views.ChangePassAPI.as_view()),
    path('auth/change/forgot', authentication_views.ForgotPassAPI.as_view()),
    path('auth/login/', TokenObtainPairView.as_view()),
    path('auth/token/refresh/', TokenRefreshView.as_view()),
]

router = routers.DefaultRouter()
router.register('city', views.CityView, 'city')
router.register('company', views.CompanyView, 'company')
router.register('vibrouser', authentication_views.VibroUserView, 'vibrouser')
router.register('machine', views.MachineView, 'machine')
router.register('sensor', views.SensorView, 'sensor')
router.register('gear', views.GearView, 'gear')
router.register('axis', views.AxisView, 'axis')
router.register('bearing', views.BearingView, 'bearing')
router.register('coupling', views.CouplingView, 'coupling')
router.register('image', views.ImageView, 'image')
router.register('date', views.DateView, 'date')
router.register('measurement', views.MeasurementView, 'measurement')
router.register('flaw', views.FlawView, 'flaw')
router.register('report', views.ReportView, 'report')  # TODO needs testing
router.register('termal', views.TermoImageView, 'termal')
router.register('point', views.PointView, 'point')


urlpatterns = auth_views + router.urls
"""
GET REQUESTS
trailing slash followed by query params
###########################
DELETE REQUESTS
trailing slash followed by id of instance to be deleted then another slash
###########################
POST REQUESTS
trailing slash followed by id of instance to be added then trailing slash again
PATCH REQUESTS
trailing slash followed by id of instance to be patched then trailing slash
"""
