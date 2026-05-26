from rest_framework import serializers
from .models import StatusHistory


class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusHistory
        fields = ['id', 'issue_id', 'previous_status', 'status', 'comments', 'team_member_id', 'change_type', 'changed_at', 'created_at', 'created_by', 'updated_at', 'updated_by']
        read_only_fields = ['id', 'created_at', 'updated_at']

