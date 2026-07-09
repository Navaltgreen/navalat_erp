from django.contrib import admin
from .models import StatusHistory


@admin.register(StatusHistory)
class HistoryAdmin(admin.ModelAdmin):
    list_display = (
        "work_id",
        "previous_status",
        "status",
        "comments",
        "team_member_id",
        "change_type",
        "changed_at",
        "created_at",
        "created_by",
        "updated_at",
        "updated_by",
    )
