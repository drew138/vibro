from django.contrib.auth.admin import UserAdmin
from . import models as custom_models
from .admin_forms import MyUserAdmin
from django.contrib import admin
# !Delete file

admin.site.register(custom_models.City)
admin.site.register(custom_models.Company)
admin.site.register(custom_models.VibroUser, MyUserAdmin)
admin.site.register(custom_models.Profile)
admin.site.register(custom_models.Machine)
admin.site.register(custom_models.Image)
admin.site.register(custom_models.Date)
admin.site.register(custom_models.Measurement)
admin.site.register(custom_models.TermoImage)
admin.site.register(custom_models.Point)
