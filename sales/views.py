from .models import (
    Lead,
    Proposal,
    Quotation,
    PurchaseOrder
)

from .serializers import (
    LeadSerializer,
    ProposalSerializer,
    QuotationSerializer,
    PurchaseOrderSerializer
)
from django.shortcuts import get_object_or_404
from .utils import StatusLogger
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from core.api_mixins import APIResponseMixin
from work_assignments.models import WorkAssignment
from teams.models import Team
from clients.models import Client
from rest_framework.viewsets import ViewSet
from django.utils import timezone
from django.db import transaction

class BaseSalesViewSet(APIResponseMixin, viewsets.ModelViewSet):
    list_key = "table_data"

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().order_by("-id")
        serializer = self.get_serializer(queryset, many=True)

        data = serializer.data

        # Get all team members once
        team_map = {
            t.id: t.member
            for t in Team.objects.filter(team_id=100)
        }
        
        for item in data:
            if "pic" in item:
                print(team_map.get(item["pic"]))
                item["pic"] = team_map.get(item["pic"])

            # if "pic_for_proposal" in item:
            #     print(item["pic_for_proposal"])
            #     item["pic_for_proposal"] = team_map.get(item["pic_for_proposal"])
        
        return self.get_response(
            data={self.list_key: data},
            message=f"{self.list_key} fetched successfully",
        )
    @action(detail=False, methods=["get"])
    def team_members(self, request):
        # members = Team.objects.values("id", "member").filter().order_by("id")
        members = Team.objects.filter(team_id=100, member__isnull=False).values("id", "member").order_by("id")
        return self.get_response(
            data={"team_members": list(members)},
            message="Team members fetched successfully"
        )

    @action(detail=False, methods=["get"], url_path="prefilters")
    def prefilters(self, request):
        module = request.query_params.get("module")

        if module == "lead":
            filters = {
                "division": ["OCEANIX", "NAVALT"],
                "client": list(
                    Client.objects.values_list("name", flat=True)
                    .distinct()
                    .order_by("name")
                ),
                "lead_source": ["WEBSITE"],
                "lead_status": ["Declined","Pending","Converted"],
            }

        elif module == "proposal":
            filters = {
                "division": ["OCEANIX", "NAVALT"],
                "client": list(
                    Client.objects.values_list("name", flat=True)
                    .distinct()
                    .order_by("name")
                ),
                "pic_for_proposal": list(
                Team.objects.filter(team_id=100,member__isnull=False)
                .values_list("member", flat=True)
                .order_by("member")
            ),
            }

        elif module == "quotation":
            filters = {
                "division": ["OCEANIX", "NAVALT"],
                "client": list(
                    Client.objects.values_list("name", flat=True)
                    .distinct()
                    .order_by("name")
                ),
                "pic_for_proposal": list(
                Team.objects.filter(team_id=100,member__isnull=False)
                .values_list("member", flat=True)
                .order_by("member")
            ),
            }
        elif module == "purchase":
            filters = {
                "division": ["OCEANIX", "NAVALT"],
                "client": list(
                    Client.objects.values_list("name", flat=True)
                    .distinct()
                    .order_by("name")
                ),
                "pic_for_proposal": []#need to be pic
            }

        else:
            return Response(
            {
                "message": "Invalid module"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

        return self.get_response(
            data={"filters": filters},
            message=f"{module.capitalize()} prefilters fetched successfully",
        )

class LeadViewSet(BaseSalesViewSet):
    queryset = Lead.objects.filter(is_deleted=False)
    serializer_class = LeadSerializer
    # @StatusLogger.log_status(change_type="lead", new_status="Approved", comments="Lead converted to Proposal")
    @action(detail=True, methods=["post"])
    def convert(self, request, pk=None):
        lead = self.get_object()

        if not request.data.get('is_converted') and request.data.get('lead_status') == 'Declined':
            lead.lead_status = 'Declined'
            lead.save(update_fields=['lead_status'])
            return Response({
                "message": "Lead declined successfully"
            }, status=status.HTTP_200_OK)

        proposal_fields = ['proposal_number', 'pic_for_proposal', 'attachment']
        proposal_payload = {
            field: request.data[field]
            for field in proposal_fields
            if field in request.data
        }
        
        serializer = ProposalSerializer(data={**proposal_payload, 'lead': lead.id})

        if not serializer.is_valid():
            return Response(
                {"message": "Validation failed", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                proposal = serializer.save()

                # Only create a WorkAssignment entry if a PIC was actually set
                if proposal.pic_for_proposal:
                    WorkAssignment.objects.create(
                        work_id=proposal.id,
                        assigned_date=timezone.now(),
                        status="Assigned",
                        team_member_id=proposal.pic_for_proposal,
                        comments=f"Assigned on proposal creation (Proposal #{proposal.id})",
                    )

                lead.is_converted = request.data.get('is_converted')
                lead.lead_status = request.data.get('lead_status')
                lead.save(update_fields=['is_converted', 'lead_status'])

        except Exception as e:
            return Response(
                {"message": "Failed to convert lead", "error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({
            "message": "Lead converted successfully",
            "proposal_id": proposal.id
        }, status=status.HTTP_201_CREATED)

    @StatusLogger.log_status_change(change_type="lead", status_field="lead_status", comments="Lead updated")
    @action(detail=True, methods=["put"])
    def update_lead(self, request, pk=None):
        lead = self.get_object()
        previous_status = lead.lead_status
        previous_pic = lead.pic   # To know pic has changed or not

        if lead.is_converted:
            return Response(
                {"message": "Converted lead cannot be modified"},
                status=status.HTTP_400_BAD_REQUEST
            )
        allowed_fields = [
            "name",
            "title",
            "date",
            "division",
            "client",
            "email",
            "phone",
            "lead_status",
            "lead_source",
            "last_activity",
        ]

        for field in allowed_fields:
            if field in request.data:
                setattr(lead, field, request.data[field])

        pic_changed = False

        # Handle PIC separately
        if "pic" in request.data:
            team = get_object_or_404(Team, pk=request.data["pic"])
            if team.id != previous_pic:
                pic_changed = True
            lead.pic = team.id      # or team.name, depending on what you want to store

        lead.save()

        # Create a WorkAssignment entry only if pic was actually changed
        if pic_changed:
            # work = Works.objects.filter(project_id=lead.id, subcategory="Lead").first()
            # if work:
            WorkAssignment.objects.create(
                work_id=lead.id,
                assigned_date=timezone.now(),
                status="Reassigned",
                team_member_id=lead.pic,
                comments=f"PIC changed on Lead #{lead.id} (previous: {previous_pic}, new: {lead.pic})",
                created_by=request.user.team_member_id,
            )

        # log_status_history(
        #     work_id=lead.id,
        #     previous_status=previous_status,
        #     new_status=lead.lead_status,
        #     change_type="lead_status",
        #     team_member_id=lead.team_member_id,
        #     comments="Lead updated"
        # )

        return self.get_response(
            data=LeadSerializer(lead).data,
            message="Lead updated successfully",
        )
        if lead.lead_status == 'Decline':
            comments= "Lead Declined"
        else:
            comments= "Lead Updated"

        if lead.lead_status != previous_status:
            log_status_history(
            work_id=lead.id,
            previous_status=previous_status,
            new_status=lead.lead_status,
            change_type="lead",
            team_member_id=lead.team_member_id,
            comments=comments
        )
        return Response(
            {
                "message": "Lead updated successfully",
                "lead_id": lead.id
            },
            status=status.HTTP_200_OK
        )

    # @StatusLogger.log_status(change_type="lead", new_status="deleted", comments="Lead deleted")
    @action(detail=True, methods=["put"])
    def delete_lead(self, request, pk=None):

        lead = self.get_object()

        if lead.is_converted:
            return Response(
                {
                    "message":
                    "Converted lead cannot be deleted"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        lead.is_deleted = True
        lead.save(update_fields=["is_deleted"])

        return Response(
            {"message": "Lead deleted successfully"},
            status=status.HTTP_200_OK
            )

class ProposalViewSet(BaseSalesViewSet):
    queryset = Proposal.objects.filter()
    serializer_class = ProposalSerializer

    @action(detail=False, methods=["get"])
    def get_proposals(self, request):
        proposals = Proposal.objects.select_related('lead').all()

        data = []
        for proposal in proposals:
            lead = proposal.lead
            data.append({
                "id": proposal.id,
                "sl_no": proposal.id,
                "name": lead.name if lead else None,
                "title": lead.title if lead else None,
                "client": lead.client if lead else None,
                "email": lead.email if lead else None,
                "phone": lead.phone if lead else None,
                "proposal_status": proposal.proposal_status,
                "is_converted": proposal.is_converted,
                "proposal_number": proposal.proposal_number,
                "pic_for_proposal": proposal.pic_for_proposal,
                "attachment": proposal.attachment,
                "remarks": proposal.remarks,
                "converted_date": proposal.converted_date,
                "lead": proposal.lead_id,
            })

        return Response({
            "success": True,
            "message": "Proposals fetched successfully",
            "data": {"table_data": data},
            "meta": {}
        })

    @action(detail=True, methods=["get"])
    def quotations(self, request, pk=None):
        proposal = self.get_object()

        quotations = (
            proposal.quotations.all()
            .order_by("-id")
            .values(
                "id",
                "quotation_status",
                "version",
                "quotation_number",
                "status",
                "amount",
                "is_converted",
                "versions",
                "remarks",
                "pic",
                "converted_date",
                "attachment",
            )
        )

        serializer = QuotationSerializer(quotations, many=True)

        return Response({
            "success": True,
            "message": "Quotations fetched successfully",
            "data": {
                "quotations": list(quotations)
            },
            "meta": {}
        })

    # @StatusLogger.log_status(change_type="proposal", new_status="converted", comments="Proposal converted to Quotation")
    @action(detail=True, methods=["post"])
    def convert(self, request, pk=None):
        proposal = self.get_object()

        if not request.data.get('is_converted') and request.data.get('proposal_status')=='Declined':
            proposal.proposal_status='Declined'
            proposal.save(update_fields=['is_converted','proposal_status'])
            return Response({
                "message": "Proposal Declined successfully",
            })  
        proposal.is_converted = request.data.get('is_converted')
        proposal.proposal_status=request.data.get('proposal_status')
        proposal.save()

        if request.data.get('is_converted'):
            po = PurchaseOrder.objects.filter(Proposal=proposal).first()
            if not po:
                last_quotation = proposal.quotations.order_by('-id').first()
                po = PurchaseOrder.objects.create(
                    Proposal=proposal,
                    remarks=proposal.remarks,
                    converted_date=timezone.now().date(),
                    pic=proposal.pic_for_proposal,
                    amount=last_quotation.amount if last_quotation else None
                )
            return Response(
                {
                    "message": "Proposal updated successfully",
                    "purchase_id": po.id,
                },
                status=status.HTTP_200_OK
            )

        else:
            quotation = Quotation.objects.create(
                proposal=proposal,
                remarks=request.data.get('remarks'),
                amount=request.data.get('amount'),
                pic=proposal.pic_for_proposal,
                status="Pending",
                converted_date=timezone.now().date()
            )
            return Response({
            "message": "Proposal converted successfully",
            "quotation_id": quotation.id
            })
        
    @action(detail=False, methods=["get"])
    def check_proposal_number(self, request):           # To check proposal_number already exists or not (To ensure new proposal_number is unique)
        proposal_number = request.query_params.get("proposal_number")

        if not proposal_number:
            return Response(
                {"message": "proposal_number is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        exists = Proposal.objects.filter(proposal_number=proposal_number).exists()

        return Response(
            {"check": exists},
            status=status.HTTP_200_OK,
        )

    @StatusLogger.log_status_change(change_type="proposal", status_field="proposal_status", comments="Proposal updated")
    @action(detail=True, methods=["put"])
    def update_proposal(self, request, pk=None):
        proposal = self.get_object()
        previous_pic = proposal.pic_for_proposal   # For identify pic changes

        if proposal.is_converted:
            return Response(
                {"message": "Converted proposal cannot be modified"},
                status=status.HTTP_400_BAD_REQUEST
            )
        allowed_fields = [
            "name",
            "title",
            "date",
            "division",
            "client",
            "email",
            "phone",
            "remarks",
            "proposal_number",
            "attachment"
        ]

        for field in allowed_fields:
            if field in request.data:
                setattr(
                    proposal,
                    field,
                    request.data[field]
                )
        pic_changed = False
        if "pic" in request.data:
            team = get_object_or_404(Team, pk=request.data["pic"])
            if team.id != previous_pic:
                pic_changed = True
            proposal.pic_for_proposal = team.id

        is_converted = request.data.get("is_converted")
        po = None

        try:
            with transaction.atomic():  # To avoid classic partial-write problem
                if is_converted:
                    proposal.is_converted = True

                proposal.save()

                if pic_changed:
                    WorkAssignment.objects.create(
                        work_id=proposal.id,
                        assigned_date=timezone.now(),
                        status="Reassigned",
                        team_member_id=proposal.pic_for_proposal,
                        comments=f"PIC changed on Proposal #{proposal.id} (previous: {previous_pic}, new: {proposal.pic_for_proposal})",
                        created_by=request.user.team_member_id,
                    )

                if is_converted:
                    po = PurchaseOrder.objects.filter(Proposal=proposal).first()
                    proposal.proposal_status='Approved'
                    proposal.save()
                    if not po:
                        po = PurchaseOrder.objects.create(
                            Proposal=proposal,
                            remarks=proposal.remarks,
                            converted_date=timezone.now().date(),
                            pic=proposal.pic_for_proposal,
                        )
        except Exception as e:
            return Response(
                {"message": "Failed to update proposal", "error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "message": "Proposal updated successfully",
                "proposal_id": proposal.id,
                "purchase_order_id": po.id if po else None,
            },
            status=status.HTTP_200_OK
        )
class QuotationViewSet(BaseSalesViewSet):
    queryset = Quotation.objects.filter()
    serializer_class = QuotationSerializer
    # @StatusLogger.log_status(change_type="quotation", new_status="updated", comments="Quotation updated")
    @action(detail=True, methods=["put"])
    def update_quotation(self, request, pk=None):
        quotation = self.get_object()

        if quotation.is_converted:
            return Response(
                {"message": "Converted quotation cannot be modified"},
                status=status.HTTP_400_BAD_REQUEST
            )

        allowed_fields = [
            "quotation_number",
            "status",
            "amount",
            "remarks",
            "attachment",
            "is_converted"
        ]

        updated_fields = []

        for field in allowed_fields:
            if field in request.data:
                setattr(quotation, field, request.data[field])
                updated_fields.append(field)

        if "pic" in request.data:
            team = get_object_or_404(Team, pk=request.data["pic"])
            quotation.pic = team.id
            updated_fields.append("pic")

        if not updated_fields:
            return Response(
                {"message": "No valid fields provided to update"},
                status=status.HTTP_400_BAD_REQUEST
            )

        quotation.save(update_fields=updated_fields)

        return Response(
            {
                "message": "Quotation updated successfully",
                "quotation_id": quotation.id,
                "quotation_number": quotation.quotation_number,
                "version": quotation.version,
                "status": quotation.status,
                "amount": quotation.amount,
                "remarks": quotation.remarks,
                "attachment": quotation.attachment,
                "pic": quotation.pic,
                "is_converted": quotation.is_converted
            },
            status=status.HTTP_200_OK,
        )

class PurchaseOrderViewSet(BaseSalesViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
    list_key = "purchase_orders"

    def get_queryset(self):
        return PurchaseOrder.objects.select_related('Proposal', 'Proposal__lead')

    # @StatusLogger.log_status(change_type="purchase_order", new_status="updated", comments="Purchase Order updated")
    @action(detail=True, methods=["put"])
    def update_purchase(self, request, pk=None):

        purchase_order = self.get_object()

        allowed_fields = [
            "remarks",
            "purchase_order_number",
            "amount",
            "pic",
            "attachment"
        ]

        for field in allowed_fields:
            if field in request.data:
                setattr(
                    purchase_order,
                    field,
                    request.data[field]
                )

        # if "attachment" in request.FILES:
        #     purchase_order.attachment = request.FILES["attachment"]

        try:
            purchase_order.save()

        except Exception as e:
            return Response(
                {"message": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "message": "Purchase Order updated successfully",
                "purchase_order_id": purchase_order.id,
                "purchase_order_number": purchase_order.purchase_order_number,
                "amount": purchase_order.amount,
            },
            status=status.HTTP_200_OK
        )


class DashboardViewSet(APIResponseMixin, viewsets.ViewSet):

    @action(detail=False, methods=["get"], url_path="history")
    def history(self, request):

        lead_id = request.query_params.get("lead_id")

        if not lead_id:
            return Response(
                {"message": "lead_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            lead = Lead.objects.get(pk=lead_id)
        except Lead.DoesNotExist:
            return Response(
                {"message": "Lead not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        history = []

        # Lead
        history.append({
            "phase": "lead",
            "id": lead.id,
            "name": lead.name,
            "status": lead.lead_status,
            "created_at": lead.created_at,
            "converted_date": lead.converted_date,
        })

        proposals = Proposal.objects.filter(lead=lead).order_by("id")

        for proposal in proposals:

            history.append({
                "phase": "proposal",
                "id": proposal.id,
                "proposal_number": proposal.proposal_number,
                "status": proposal.proposal_status,
                "created_at": proposal.created_at,
                "converted_date": proposal.converted_date,
            })

            quotations = Quotation.objects.filter(
                proposal=proposal
            ).order_by("version")

            for quotation in quotations:

                history.append({
                    "phase": "quotation",
                    "id": quotation.id,
                    "version": quotation.version,
                    "quotation_number": quotation.quotation_number,
                    "status": quotation.quotation_status,
                    "amount": quotation.amount,
                    "created_at": quotation.created_at,
                    "converted_date": quotation.converted_date,
                })

                purchase_orders = PurchaseOrder.objects.filter(
                    quotation=quotation
                )

                for po in purchase_orders:

                    history.append({
                        "phase": "purchase",
                        "id": po.id,
                        "purchase_order_number": po.purchase_order_number,
                        "status": po.purchase_order_status,
                        "amount": po.amount,
                        "created_at": po.created_at,
                        "converted_date": po.converted_date,
                    })

        return self.get_response(
            data={
                "history": history
            },
            message="History fetched successfully",
        )