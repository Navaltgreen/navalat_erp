from rest_framework import viewsets
from rest_framework.decorators import action
from core.api_mixins import APIResponseMixin
from .models import Team
from .serializers import TeamSerializer


class TeamViewSet(APIResponseMixin, viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
#  onboarding project
    def list(self, request, *args, **kwargs):
        """Get all teams"""
        queryset = self.get_queryset()

        serializer = self.get_serializer(queryset, many=True)
        return self.get_response(
            data={"teams":serializer.data},
            message="Teams fetched successfully"
        )

    def create(self, request, *args, **kwargs):
        """Create a new team"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return self.get_response(
            data=serializer.data,
            message="Team created successfully",
            meta={"status_code": 201}
        )

    def retrieve(self, request, *args, **kwargs):
        """Get a specific team"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.get_response(
            data={"teams":serializer.data},
            message="Team retrieved successfully"
        )

    def update(self, request, *args, **kwargs):
        """Update a team"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return self.get_response(
            data=serializer.data,
            message="Team updated successfully"
        )

    def destroy(self, request, *args, **kwargs):
        """Delete a team"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return self.get_response(
            data=None,
            message="Team deleted successfully"
        )

    @action(detail=False, methods=['get'], url_path='all')
    def all_teams(self, request, *args, **kwargs):
        """Get all teams as label/value pairs"""
        queryset = self.get_queryset()
        members = Team.objects.exclude( member__isnull=False)
        
        teams = list({
            team.name: {"label": team.name, "value": str(team.id)}
            for team in members
        }.values())
        return self.get_response(
            data={"teams": teams},
            message="Teams fetched successfully"
        )
    # api for teams in works
    @action(detail=False, methods=['get'], url_path='members')
    def get_members(self, request, *args, **kwargs):
        """Get all members of a team by team id"""
        team_id = request.query_params.get('team_id')

        if not team_id:
            return self.get_response(
                data=None,
                message="team_id is required",
                meta={"status_code": 400}
            )
 
        members = Team.objects.filter(team_id=team_id).exclude(member=None)
        if not members.exists():
            return self.get_response(
                data=None,
                message="Team not found",
                meta={"status_code": 404}
            )

        member_list = [
            {
                "id": member.id,
                "name": member.member,
            }
            for member in members
        ]

        return self.get_response(
            data={"teams": member_list},
            message="Team members fetched successfully"
        )
    