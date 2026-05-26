from django.contrib import admin
from .models import WorkAssignment


@admin.register(WorkAssignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('work_id', 'status', 'team_member_id', 'created_at')

    