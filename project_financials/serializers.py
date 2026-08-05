from rest_framework import serializers
from .models import (
    ProjectAmount,
    Milestone,
    PaymentHistory
)

class ProjectAmountSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectAmount
        fields = "__all__"


class MilestoneSerializer(serializers.ModelSerializer):
    total_received_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    class Meta:
        model = Milestone
        fields = "__all__"

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