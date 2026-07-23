from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum



from .models import (
    ProjectAmount,
    Milestone
)

from .serializers import (
    MilestoneSerializer
)

class MilestoneViewSet(viewsets.ModelViewSet):
    serializer_class = MilestoneSerializer

    def get_queryset(self):
        queryset = Milestone.objects.filter(is_deleted=False)

        project_amount_id = self.request.query_params.get('project_amount_id')
        project_id = self.request.query_params.get('project_id')

        if project_amount_id:
            queryset = queryset.filter(project_amount_id=project_amount_id)
        elif project_id:
            queryset = queryset.filter(project_amount_id__project_id=project_id)

        return queryset

    def create(self, request, *args, **kwargs):
        project_id = request.data.get('project_id')
        project_amount = ProjectAmount.objects.filter(project_id=project_id).first()
        if not project_amount:
            return Response({"detail": "No Project Amount found for this project."}, status=404)

        field_mapping = {
            "amount": "milestone_amount",
            "status": "status",
            "remarks": "remarks",
            "start_date": "created_at",
            "end_date": "due_date",
            "pic": "pic",
        }
        milestone_payload = {
            model_field: request.data[payload_key]
            for payload_key, model_field in field_mapping.items()
            if payload_key in request.data
        }

        serializer = MilestoneSerializer(data={**milestone_payload, 'project_amount_id': project_amount.id})
        serializer.is_valid(raise_exception=True)
        milestone = serializer.save()

        total = project_amount.milestones.filter(is_deleted=False).aggregate(total=Sum('milestone_amount'))['total'] or 0
        project_amount.received_amount = total
        project_amount.save(update_fields=['received_amount'])

        return Response({"message": "Milestone is created", "milestone_id": milestone.id}, status=201)

    @action(detail=True, methods=["post"])
    def delete(self, request, pk=None):    # soft deletion
        milestone = self.get_object()
        milestone.is_deleted = True
        milestone.save(update_fields=['is_deleted'])
        return Response({
            "message": "Milestone deleted successfully",
            "milestone_id": milestone.id
        }, status=status.HTTP_200_OK)