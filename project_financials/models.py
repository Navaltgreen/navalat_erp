from django.db import models
from projects.models import Project

class ProjectAmount(models.Model):
    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    received_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    project = models.ForeignKey(Project,
        on_delete=models.CASCADE,
        related_name="amounts"
    )
    updated_at = models.DateTimeField(auto_now=True)

   

class Milestone(models.Model):
    project_amount_id = models.ForeignKey(ProjectAmount,
        on_delete=models.CASCADE,
        related_name="milestones")
    milestone_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    received_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    month_year = models.CharField(null=True, blank=True, max_length=50)
    stage_percent = models.CharField(null=True, blank=True, max_length=255)
    due_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(null=True, blank=True, max_length=255)
    completion_date =  models.DateTimeField(null=True, blank=True)
    invoice_no = models.CharField(null=True, blank=True, max_length=255)
    invoice_date =  models.DateTimeField(null=True, blank=True)
    invoice_attachment = models.CharField(null=True, blank=True, max_length=255)
    tds_ded = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    pending_dues = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    remarks = models.TextField(
        null=True,
        blank=True
    )
    pic = models.PositiveIntegerField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(null=True, blank=True)
    created_by = models.PositiveIntegerField(blank=True, null=True)
    updated_by = models.PositiveIntegerField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)   #received date

    def __str__(self):
        return f"Milestone #{self.pk} - {self.status or 'No status'} ({self.project_amount_id.project.name})"
    

class PaymentHistory(models.Model):
    type = models.CharField(null=True, blank=True, max_length=30)  # values can be credit or debit
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(null=True, blank=True)
    created_by = models.PositiveIntegerField(blank=True, null=True)
    updated_by = models.PositiveIntegerField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True) 


