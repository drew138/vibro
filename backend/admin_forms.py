from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django.contrib.auth.admin import UserAdmin
from .models import VibroUser
from django import forms


ADDTIONAL_USER_FIELDS = (
        (None, {'fields': ('company', 'phone', 'ext', 'celphone_one', 'celphone_two', 'user_type')}),
    )

class MyUserAdmin(UserAdmin):

    model = VibroUser
    add_fieldsets = UserAdmin.add_fieldsets + ADDTIONAL_USER_FIELDS
    fieldsets = UserAdmin.fieldsets + ADDTIONAL_USER_FIELDS

    def get_form(self, request, obj=None, **kwargs):
        
        """
        Restrict access to non superusers to change 
        certain fields in the VibroUser model.
        """

        form = super().get_form(request, obj, **kwargs)
        is_superuser = request.user.is_superuser
        disabled_fields = set() 

        if not is_superuser:
            disabled_fields |= {
                'username',
                'is_superuser',
                'user_permissions',
                'is_active',
                'is_staff',
                'groups',
            }

        for f in disabled_fields:
            if f in form.base_fields:
                form.base_fields[f].disabled = True

        return form
    
    def has_add_permission(self, request, obj=None):

        """
        restrict add permissions in the admin to superusers.
        """

        return request.user.is_superuser


    def has_delete_permission(self, request, obj=None):

        """
        restrict delete permissions in the admin to superusers.
        """

        return request.user.is_superuser


    def has_change_permission(self, request, obj=None):

        """
        restrict change permissions in the admin to superusers
        or to a users own instance.
        """

        return request.user.is_superuser or (obj and obj.id == request.user.id)