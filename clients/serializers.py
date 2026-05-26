from rest_framework import serializers
from .models import Client
from projects.models import Project


class ProjectNestedSerializer(serializers.ModelSerializer):
    """Serializer for projects nested in client response"""
    class Meta:
        model = Project
        fields = ['id', 'name']


class ClientDetailSerializer(serializers.ModelSerializer):
    """Serializer for client with nested projects (GET response)"""
    projects = ProjectNestedSerializer(many=True, read_only=True, source='get_projects')

    class Meta:
        model = Client
        fields = ['id', 'name', 'email', 'phone_number', 'country', 'address', 'projects']
        read_only_fields = ['id', 'projects']


class ClientSerializer(serializers.ModelSerializer):
    # For POST requests
    client = serializers.DictField(required=False, write_only=True)
    isExistingClient = serializers.BooleanField(required=False, write_only=True)
    projects = serializers.ListField(required=False, write_only=True)

    class Meta:
        model = Client
        fields = ['id', 'name', 'email', 'phone_number', 'country', 'address', 'client', 'isExistingClient', 'projects']
        read_only_fields = ['id']
        extra_kwargs = {
            'name': {'required': False},
            'email': {'required': False, 'allow_blank': True},
            'phone_number': {'required': False, 'allow_null': True},
            'country': {'required': False, 'allow_blank': True},
            'address': {'required': False, 'allow_blank': True},
        }

    def create(self, validated_data):
        # Extract nested data
        client_data = validated_data.pop('client', None)
        validated_data.pop('isExistingClient', None)
        projects_data = validated_data.pop('projects', None)

        # If client data is provided in nested format, use it
        if client_data:
            # Extract client fields
            name = client_data.get('name') or validated_data.get('name')
            email = client_data.get('email') or validated_data.get('email')
            phone_number = client_data.get('phone_number') or validated_data.get('phone_number')
            country = client_data.get('country') or validated_data.get('country')
            address = client_data.get('address') or validated_data.get('address')

            client = Client.objects.create(
                name=name,
                email=email,
                phone_number=phone_number,
                country=country,
                address=address
            )
        else:
            client = Client.objects.create(**validated_data)

        # Create associated projects if provided
        if projects_data:
            for project_data in projects_data:
                # Handle team_id as array (take first element if array)
                team_id = project_data.get('team_id')
                if isinstance(team_id, list) and len(team_id) > 0:
                    team_id = team_id[0]
                elif isinstance(team_id, list):
                    team_id = None

                # Handle tab as array (keep entire list)

                project = Project.objects.create(
                    name=project_data.get('name'),
                    team_id=team_id,
                    category=project_data.get('category'),
                    subcategory=project_data.get('subcategory'),
                    tab=project_data.get('tab')
                )

        return client

