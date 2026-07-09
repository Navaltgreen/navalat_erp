from rest_framework import serializers
from .models import (
    Lead,
    Proposal,
    Quotation,
    PurchaseOrder
)
from teams.models import Team

class BaseSerializer(serializers.ModelSerializer):
    sl_no = serializers.IntegerField(source="id", read_only=True)

class LeadSerializer(serializers.ModelSerializer):
    # pic = serializers.SerializerMethodField()

    class Meta:
        model = Lead
        fields = "__all__"

    # def get_pic(self, obj):
    #     team = Team.objects.filter(pk=obj.pic).first()
    #     return team.member if team else None

class ProposalSerializer(BaseSerializer):
    # pic_for_proposal = serializers.SerializerMethodField()

    class Meta:
        model = Proposal
        fields = "__all__"

    # def get_pic_for_proposal(self, obj):
    #     team = Team.objects.filter(pk=obj.pic_for_proposal).first()
    #     return team.member if team else None



class QuotationSerializer(BaseSerializer):
    # pic = serializers.SerializerMethodField()

    class Meta:
        model = Quotation
        fields = "__all__"

    # def get_pic(self, obj):
    #     team = Team.objects.filter(pk=obj.pic).first()
    #     return team.member if team else None

class PurchaseOrderSerializer(BaseSerializer):
    lead_name = serializers.SerializerMethodField()
    lead_title = serializers.SerializerMethodField()
    lead_client = serializers.SerializerMethodField()
    lead_email = serializers.SerializerMethodField()
    lead_phone = serializers.SerializerMethodField()
    lead_division = serializers.SerializerMethodField()


    class Meta:
        model = PurchaseOrder
        fields = [
            'sl_no',
            'id',
            'purchase_order_status',
            'Proposal',
            'purchase_order_number',
            'amount',
            'attachment',
            'remarks',
            'converted_date',
            'pic',
            'lead_name',
            'lead_title',
            'lead_client',
            'lead_email',
            'lead_phone',
            'lead_division',
        ]

    def get_lead(self, obj):
        return getattr(obj.Proposal, 'lead', None)

    def get_lead_name(self, obj):
        lead = self.get_lead(obj)
        return lead.name if lead else None

    def get_lead_title(self, obj):
        lead = self.get_lead(obj)
        return lead.title if lead else None

    def get_lead_client(self, obj):
        lead = self.get_lead(obj)
        return lead.client if lead else None

    def get_lead_email(self, obj):
        lead = self.get_lead(obj)
        return lead.email if lead else None

    def get_lead_phone(self, obj):
        lead = self.get_lead(obj)
        return lead.phone if lead else None

    def get_lead_division(self, obj):
        lead = self.get_lead(obj)
        return lead.division if lead else None


