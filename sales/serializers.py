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


class LeadSerializer(BaseSerializer):
    class Meta:
        model = Lead
        fields = "__all__"
    def get_team_member_name(self, obj):
        if obj.team_member_id:
            team = Team.objects.filter(id=obj.team_member_id).first()
            return team.member if team else None
        return None


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


