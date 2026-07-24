from django.contrib import admin
from .models import ProjectAmount, Milestone, PaymentHistory


@admin.register(ProjectAmount)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'project')

@admin.register(Milestone)
class Milestone(admin.ModelAdmin):
    list_display = (
        "id",
        "milestone_amount"
    )

@admin.register(PaymentHistory)
class PaymentHistory(admin.ModelAdmin):
    list_display = ('id', 'amount')

   