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
    pic = serializers.SerializerMethodField()

    class Meta:
        model = Lead
        fields = "__all__"

    def get_pic(self, obj):
        team = Team.objects.filter(pk=obj.pic).first()
        return team.member if team else None

class ProposalSerializer(BaseSerializer):
    pic_for_proposal = serializers.SerializerMethodField()

    class Meta:
        model = Proposal
        fields = "__all__"

    def get_pic_for_proposal(self, obj):
        team = Team.objects.filter(pk=obj.pic_for_proposal).first()
        return team.member if team else None



class QuotationSerializer(BaseSerializer):
    pic = serializers.SerializerMethodField()

    class Meta:
        model = Quotation
        fields = "__all__"

    def get_pic(self, obj):
        team = Team.objects.filter(pk=obj.pic).first()
        return team.member if team else None

class PurchaseOrderSerializer(BaseSerializer):
    class Meta:
        model = PurchaseOrder
        fields = "__all__"


