from django.contrib import admin
from .models import Works


@admin.register(Works)
class WorkAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'status', 'project_id')

