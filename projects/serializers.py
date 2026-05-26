from rest_framework import serializers
from .models import Project
from teams.models import Team
from clients.models import Client


class ClientNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'name']


class ProjectSerializer(serializers.ModelSerializer):
    # Write-only inputs expected from client
    client_id = serializers.PrimaryKeyRelatedField(queryset=Client.objects.all(), write_only=True, required=False, allow_null=True)
    team_ids = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), many=True, write_only=True, required=False)
    tabs = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    categories = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    subcategories = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)

    # Read-only fields shown in responses (match your current response keys)
    client = ClientNestedSerializer(read_only=True)
    team_id = serializers.SerializerMethodField(read_only=True)
    tab = serializers.SerializerMethodField(read_only=True)
    category = serializers.SerializerMethodField(read_only=True)
    subcategory = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Project
        # include all model fields you want returned + the write-only inputs
        fields = (
            'id', 'name', 'client_id', 'client', 'team_ids', 'tabs', 'categories', 'subcategories',
            'team_id', 'tab', 'category', 'subcategory',
            'created_at', 'created_by', 'updated_at', 'updated_by',
        )

    def get_team_id(self, obj):
        # Project.team_id is a JSONField storing list of team pks
        return getattr(obj, 'team_id', []) or []

    def get_tab(self, obj):
        return getattr(obj, 'tab', []) or []

    def get_category(self, obj):
        return getattr(obj, 'category', []) or []

    def get_subcategory(self, obj):
        return getattr(obj, 'subcategory', []) or []

    def _assign_lists(self, instance, client_obj, team_objs, tabs, categories, subcategories):
        # Assign JSON/list fields directly on the model
        if client_obj is not None:
            instance.client = client_obj
        if team_objs is not None:
            # team_objs is a list of Team instances (PrimaryKeyRelatedField validated them)
            instance.team_id = [int(t.pk) for t in team_objs]
        if tabs is not None:
            instance.tab = tabs
        if categories is not None:
            instance.category = categories
        if subcategories is not None:
            instance.subcategory = subcategories
        instance.save()

    def create(self, validated_data):
        client_obj = validated_data.pop('client_id', None)
        team_objs = validated_data.pop('team_ids', None)
        tabs = validated_data.pop('tabs', None)
        categories = validated_data.pop('categories', None)
        subcategories = validated_data.pop('subcategories', None)

        project = Project.objects.create(**validated_data)
        self._assign_lists(project, client_obj, team_objs, tabs, categories, subcategories)
        return project

    def update(self, instance, validated_data):
        client_obj = validated_data.pop('client_id', None)
        team_objs = validated_data.pop('team_ids', None)
        tabs = validated_data.pop('tabs', None)
        categories = validated_data.pop('categories', None)
        subcategories = validated_data.pop('subcategories', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        self._assign_lists(instance, client_obj, team_objs, tabs, categories, subcategories)
        return instance
