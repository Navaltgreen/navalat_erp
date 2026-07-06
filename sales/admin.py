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
        "get_lead_name",
        "lead",
        "get_lead_client",
        "pic_for_proposal",
        "converted_date",
    )
    search_fields = (
        "proposal_number",
        "lead__name",
        "lead__client",
        "lead__client",
    )
    list_filter = ("converted_date",)
    autocomplete_fields = ("lead",)

    def get_lead_name(self, obj):
        return obj.lead.name
    get_lead_name.short_description = "Name"
    get_lead_name.admin_order_field = "lead__name"

    def get_lead_client(self, obj):
        return obj.lead.client
    get_lead_client.short_description = "Client"
    get_lead_client.admin_order_field = "lead__client"


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