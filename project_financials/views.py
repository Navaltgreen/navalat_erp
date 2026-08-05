from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum, Case, When, F, Value, DecimalField
from django.db.models import Sum
from .utils import PaymentHistoryLogger
from sales.utils import StatusLogger



from .models import (
    ProjectAmount,
    Milestone,
    PaymentHistory
)

from .serializers import (
    MilestoneSerializer,
    PaymentHistorySerializer
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

        queryset = queryset.annotate(
        total_received_amount=Sum(
            Case(
                When(payment_history__payment_type='credit', then=F('payment_history__amount')),
                When(payment_history__payment_type='debit', then=-F('payment_history__amount')),
                default=Value(0),
                output_field=DecimalField(max_digits=12, decimal_places=2),
                )
            )
        )

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

    @action(detail=True, methods=["post"])
    def update_received_amount(self, request, pk=None):
        # Handles updating the received amount 
        milestone = self.get_object()
        field_mapping = {
            "received_amount": "received_amount",
            # "status": "status",
            # "remarks": "remarks",
            # "start_date": "created_at",
            # "end_date": "due_date",
            "pic": "pic",
            # "payment_type": "payment_type"
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
            return Response({"detail": "No Project Amount found for this project."}, status=400)
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
        current_status = ""
        if request.data.get('payment_type'):
            if request.data.get('payment_type') == "credit":
                current_status = "Payment Received"
        else:
            current_status = "Amount Debited"

        # if payment receives or debites it should reflect in the payment history table
        if request.data.get('received_amount'):
            PaymentHistoryLogger.log_payment_history(
                        payment_id=project_amount.id,
                        previous_status=None,
                        current_status=current_status,
                        amount=request.data.get('received_amount'),
                        payment_type=request.data.get('payment_type'),
                        milestone=milestone,
                        remarks=request.data.get('remarks'),
                        comments=f"{request.data.get('received_amount')} received",
                    )
        return Response({
            "message": "Received Amount updated successfully",
            "milestone_id": milestone.id
        }, status=status.HTTP_200_OK)


    def update(self, request, *args, **kwargs):  # mainly for status updation
        milestone = self.get_object()
        previous_status = milestone.status

        field_mapping = {
            "received_amount": "received_amount",
            "status": "status",
            "remarks": "remarks",
            "start_date": "created_at",
            "end_date": "due_date",
            "pic": "pic",
            "payment_type": "payment_type"
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

        # If milestone status is changed, it should reflect in the status history table
        if request.data.get('status'):
            StatusLogger.log_status_history(
                work_id=milestone.id,   #work id is milestone id
                previous_status=previous_status,
                new_status=request.data.get('status'),
                change_type="Milestone",
                team_member_id=self.request.user.team_member_id,
                comments="Milestone status has been changed",
            )

        return Response({
            "message": "Milestone status updated successfully",
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

class PaymentHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PaymentHistorySerializer

    def get_queryset(self):
        # To list payment history milestone wise
        queryset = PaymentHistory.objects.all().order_by('-created_at')

        milestone_id = self.request.query_params.get('milestone_id')
        project_id = self.request.query_params.get('project_id')

        if milestone_id:
            queryset = queryset.filter(milestone_id=milestone_id)
        elif project_id:
            queryset = queryset.filter(milestone__project_amount_id__project_id=project_id)

        return queryset