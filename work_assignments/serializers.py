from rest_framework import serializers
from .models import WorkAssignment


class WorkAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkAssignment
        fields = ['id', 'work_id', 'assigned_date', 'updated_date', 'actual_date', 'status', 'comments', 'team_member_id', 'created_at', 'created_by', 'updated_at', 'updated_by']
        read_only_fields = ['id', 'created_at', 'updated_at']

