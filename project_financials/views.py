from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum
from .utils import PaymentHistoryLogger



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
            "amount": "milestone_amount",   # amount is money to be received (milestone_amount)
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

        return Response({"message": "Milestone is created", "milestone_id": milestone.id}, status=201)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        milestone = self.get_object()

        field_mapping = {
            "received_amount": "received_amount",
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

        # Allow moving milestone to a different project, if project_id is passed
        project_id = request.data.get('project_id')
        project_amount = ProjectAmount.objects.filter(project_id=project_id).first()
        if not project_amount:
            return Response({"detail": "No Project Amount found for this project."}, status=404)
        milestone_payload['project_amount_id'] = project_amount.id

        serializer = MilestoneSerializer(
            milestone, data=milestone_payload, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Update the received_amount in the ProjectAmount table
        total = project_amount.milestones.filter(is_deleted=False).aggregate(total=Sum('received_amount'))['total'] or 0
        project_amount.received_amount = total
        project_amount.save(update_fields=['received_amount'])

        # Logs an entry into the payment history table
        current_status = payment_type = ""
        if request.data.get('received_amount') > 0:
            current_status = "Payment Received"
            payment_type = "credit"
        else:
            payment_type = "debit"

        PaymentHistoryLogger.log_payment_history(
                    payment_id=project_amount.id,
                    previous_status=None,
                    current_status=current_status,
                    amount=request.data.get('received_amount'),
                    type=payment_type,
                    comments=f"{request.data.get('received_amount')} received",
                )

        return Response({
            "message": "Milestone updated successfully",
            "milestone_id": milestone.id
        }, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    @action(detail=True, methods=["post"])
    def delete(self, request, pk=None):    # soft deletion
        milestone = self.get_object()
        milestone.is_deleted = True
        milestone.save(update_fields=['is_deleted'])
        return Response({
            "message": "Milestone deleted successfully",
            "milestone_id": milestone.id
        }, status=status.HTTP_200_OK)