from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import routers
from django.urls import path
from . import views


# TODO test endpoints
auth_views = [
    path('auth/register', views.RegisterAPI.as_view()),
    path('auth/user', views.UserAPI.as_view()),
    path('auth/reset', views.ResetAPI.as_view()),
    path('auth/change', views.ChangePassAPI.as_view()),
    path('auth/login/', TokenObtainPairView.as_view()),
    path('auth/token/refresh/', TokenRefreshView.as_view()),
    # path('rep', views.MockReport.as_view())
]

router = routers.DefaultRouter()
router.register('city', views.CityView, 'city')
router.register('company', views.CompanyView, 'company')
router.register('machine', views.MachineView, 'machine')
router.register('image', views.ImageView, 'image')
router.register('date', views.DateView, 'date')
router.register('measurement', views.MeasurementView, 'measurement')
router.register('termal', views.TermoImageView, 'termal')
router.register('point', views.PointView, 'point')
router.register('report', views.ReportView, 'report')  # TODO needs testing


urlpatterns = auth_views + router.urls
