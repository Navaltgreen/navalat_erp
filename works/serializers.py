from rest_framework import serializers
from .models import Works


class WorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Works
        fields = ['id', 'project_id', 'category', 'subcategory', 'tab', 'status', 'images', 'description', 'comments', 'team_id', 'created_at', 'created_by', 'updated_at', 'updated_by']
        read_only_fields = ['id', 'created_at', 'updated_at']

