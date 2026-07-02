from rest_framework import serializers
from .models import Team


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'team_id', 'name', 'member']
        read_only_fields = ['id', 'created_at', 'updated_at']
        
    
    @staticmethod
    def get_team_members(team_id):
        members= (
            Team.objects
            .filter(team_id=team_id, member__isnull=False)
            .exclude(member="")
            .values("id", "member")
            .distinct()
            .order_by("team_id")
        )

        return [
            {
                "id": member["id"],
                "name": member["member"]
            }
            for member in members
        ]
    @staticmethod
    def get_teams():
        return (
                Team.objects
                .filter(member__isnull=False)   # fixed: was exclude
                .exclude(member="")
                .values("team_id", "name")
                .distinct()
                .order_by("team_id")
            )

