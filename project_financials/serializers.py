from rest_framework import serializers
from .models import (
    ProjectAmount,
    Milestone,
    PaymentHistory
)
from teams.models import Team

class ProjectAmountSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectAmount
        fields = "__all__"


class MilestoneSerializer(serializers.ModelSerializer):
    total_received_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    invoice_to = serializers.SerializerMethodField()
    invoice_by = serializers.SerializerMethodField()
    pic = serializers.SerializerMethodField()

    class Meta:
        model = Milestone
        fields = "__all__"

    def get_invoice_to(self, obj):
        return Team.objects.filter(pk=obj.invoice_to).values_list("member", flat=True).first()

    def get_invoice_by(self, obj):
        return Team.objects.filter(pk=obj.invoice_by).values_list("member", flat=True).first()

    def get_pic(self, obj):
        return Team.objects.filter(pk=obj.pic).values_list("member", flat=True).first()

class PaymentHistorySerializer(serializers.ModelSerializer):
    milestone_id = serializers.IntegerField(source='milestone.id', read_only=True)

    class Meta:
        model = PaymentHistory
        fields = [
            'id',
            'payment_id',
            'milestone_id',
            'payment_type',
            'amount',
            'previous_status',
            'current_status',
            'comments',
            'remarks',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]