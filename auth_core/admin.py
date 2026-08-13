from django.contrib import admin
from .models import (ERPUser
)


@admin.register(ERPUser)
class ERPUser(admin.ModelAdmin):
    list_display = (
        "id",
        "username",
        "email",
        "first_name",
   
    )
