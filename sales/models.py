from django.db import models
from django.utils import timezone
from datetime import date


class BaseModel(models.Model):
    name = models.CharField(max_length=255)
    title = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField(default=date.today)
    division = models.CharField(max_length=255, blank=True, null=True)
    client = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True,unique=True)
    phone = models.CharField(max_length=30, blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    team_member_id=models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Lead(BaseModel):
    lead_status = models.CharField(max_length=100, blank=True, null=True,default="Pending")
    lead_source = models.CharField(max_length=100, blank=True, null=True)
    converted_date = models.DateField(blank=True, null=True)
    pic = models.PositiveIntegerField(blank=True, null=True)
    is_converted = models.BooleanField(default=False)
    remarks = models.TextField(blank=True, null=True)


    def __str__(self):
        return self.name


class Proposal(models.Model):
    proposal_status = models.CharField(max_length=100, blank=True, null=True,default="Pending")

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

    pic_for_proposal = models.PositiveIntegerField(blank=True, null=True)


    attachment = models.CharField(
        max_length=1000,
        blank=True,
        null=True
    )

    remarks = models.TextField(blank=True, null=True)
    converted_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Quotation(models.Model):
    quotation_status = models.CharField(max_length=100, blank=True, null=True,default="Pending")
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
    pic = models.PositiveIntegerField(blank=True, null=True)
    converted_date = models.DateField(blank=True, null=True)
    attachment = models.CharField(
        max_length=1000,
        unique=True,
         blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class PurchaseOrder(models.Model):
    purchase_order_status = models.CharField(max_length=100, blank=True, null=True,default="Pending")
    Proposal = models.ForeignKey(
        Proposal,
        on_delete=models.CASCADE,
        related_name="purchase_orders"
    )

    purchase_order_number = models.IntegerField(
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

    attachment = models.CharField(
        max_length=1000,
        blank=True,
        null=True
    )
    remarks = models.TextField(blank=True, null=True)
    converted_date = models.DateField(blank=True, null=True)
    pic = models.PositiveIntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)

        if is_new and self.purchase_order_number is None:
            self.purchase_order_number = self.id
            super().save(update_fields=['purchase_order_number'])

    def __str__(self):
        return f"PO #{self.purchase_order_number or self.id} - {self.Proposal}"


    