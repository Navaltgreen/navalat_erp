from rest_framework import serializers
from .models import (
    Lead,
    Proposal,
    Quotation,
    PurchaseOrder
)


class BaseSerializer(serializers.ModelSerializer):
    sl_no = serializers.IntegerField(source="id", read_only=True)


class LeadSerializer(BaseSerializer):
    class Meta:
        model = Lead
        fields = "__all__"


class ProposalSerializer(BaseSerializer):
    class Meta:
        model = Proposal
        fields = "__all__"


class QuotationSerializer(BaseSerializer):
    class Meta:
        model = Quotation
        fields = "__all__"


class PurchaseOrderSerializer(BaseSerializer):
    class Meta:
        model = PurchaseOrder
        fields = "__all__"


