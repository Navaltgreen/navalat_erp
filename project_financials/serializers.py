from rest_framework import serializers
from .models import (
    ProjectAmount,
    Milestone
)

class ProjectAmountSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectAmount
        fields = "__all__"


class MilestoneSerializer(serializers.ModelSerializer):

    class Meta:
        model = Milestone
        fields = "__all__"