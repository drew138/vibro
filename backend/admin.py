from django.contrib.auth.admin import UserAdmin
from .admin_forms import MyUserAdmin
from django.contrib import admin
from . import models


admin.site.register(models.City)
admin.site.register(models.Company)
admin.site.register(models.VibroUser, MyUserAdmin)
admin.site.register(models.Profile)
admin.site.register(models.Machine)
admin.site.register(models.Image)
admin.site.register(models.Measurement)
admin.site.register(models.TermoImage)
admin.site.register(models.Point)
admin.site.register(models.Tendency)
admin.site.register(models.Espectra)
admin.site.register(models.TimeSignal)
