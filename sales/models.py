from django.db import models
from django.utils import timezone
from datetime import date


class BaseModel(models.Model):
    name = models.CharField(max_length=255)
    title = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField(default=date.today)
    division = models.CharField(max_length=255, blank=True, null=True)
    client = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=30, blank=True, null=True)
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Lead(BaseModel):
    lead_status = models.CharField(max_length=100, blank=True, null=True)
    lead_source = models.CharField(max_length=100, blank=True, null=True)
    last_activity = models.DateField(blank=True, null=True)
    pic = models.CharField(max_length=255, blank=True, null=True)
    is_converted = models.BooleanField(default=False)
    remarks = models.TextField(blank=True, null=True)


    def __str__(self):
        return self.name


class Proposal(BaseModel):
    lead = models.ForeignKey(
        Lead,
        on_delete=models.CASCADE,
        related_name="proposals"
    )
    is_converted = models.BooleanField(default=False)

    proposal_number = models.CharField(
        max_length=100,
        unique=True,
        blank=True,
        null=True
    )

    pic_for_proposal = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    attachment = models.FileField(
        upload_to="sales/proposals/",
        blank=True,
        null=True
    )

    remarks = models.TextField(blank=True, null=True)


class Quotation(BaseModel):
    proposal = models.ForeignKey(
        Proposal,
        on_delete=models.CASCADE,
        related_name="quotations"
    )

    version = models.PositiveIntegerField(default=1)

    quotation_number = models.CharField(
        max_length=100,
        unique=True,
         null=True,
    blank=True
    )

    status = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        blank=True,
        null=True
    )

    is_converted = models.BooleanField(default=False)
    versions = models.PositiveIntegerField(default=1)
    remarks = models.TextField(blank=True, null=True)


class PurchaseOrder(BaseModel):
    quotation = models.ForeignKey(
        Quotation,
        on_delete=models.CASCADE,
        related_name="purchase_orders"
    )

    purchase_order_number = models.CharField(
        max_length=100,
        unique=True,
         blank=True,
        null=True
    )

    amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        blank=True,
        null=True
    )

    attachment = models.FileField(
        upload_to="sales/purchase_orders/",
        blank=True,
        null=True
    )
    remarks = models.TextField(blank=True, null=True)

    