from django.contrib import admin
from .models import (
    Lead,
    Proposal,
    Quotation,
    PurchaseOrder,
)


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "client",
        "lead_status",
        "lead_source",
        "pic",
        "date",
    )
    search_fields = (
        "name",
        "client",
        "email",
        "phone",
    )
    list_filter = (
        "lead_status",
        "lead_source",
        "date",
    )


@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "proposal_number",
        "name",
        "lead",
        "client",
        "pic_for_proposal",
        "date",
    )
    search_fields = (
        "proposal_number",
        "name",
        "client",
        "email",
    )
    list_filter = ("date",)
    autocomplete_fields = ("lead",)


@admin.register(Quotation)
class QuotationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "quotation_number",
        "proposal",
        "version",
        "status",
        "amount",
        "date",
    )
    search_fields = (
        "quotation_number",
        "name",
        "client",
    )
    list_filter = (
        "status",
        "version",
        "date",
    )
    autocomplete_fields = ("proposal",)


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "purchase_order_number",
        "quotation",
        "amount",
        "date",
    )
    search_fields = (
        "purchase_order_number",
        "name",
        "client",
    )
    list_filter = ("date",)
    autocomplete_fields = ("quotation",)