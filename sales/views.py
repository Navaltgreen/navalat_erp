from .models import Lead, Proposal, Quotation, PurchaseOrder
from .serializers import (
    LeadSerializer, ProposalSerializer,
    QuotationSerializer, PurchaseOrderSerializer
)
from .utils import log_status_history, log_status



from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets

from core.api_mixins import APIResponseMixin
from teams.models import Team


class BaseSalesViewSet(APIResponseMixin, viewsets.ModelViewSet):
    list_key = "table_data"

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().order_by("-id")
        serializer = self.get_serializer(queryset, many=True)
        return self.get_response(
            data={self.list_key: serializer.data},
            message=f"{self.list_key} fetched successfully"
        )

    @action(detail=False, methods=["get"])
    def team_members(self, request):
        members = (
            Team.objects
            .filter(team_id=100, member__isnull=False)
            .exclude(member="")
            .values("id", "member")
            .order_by("id")
        )
        return self.get_response(
            data={"team_members": list(members)},
            message="Team members fetched successfully"
        )


class LeadViewSet(BaseSalesViewSet):
    queryset = Lead.objects.filter(is_deleted=False)
    serializer_class = LeadSerializer

    @log_status(change_type="lead", new_status="Approved", comments="Lead converted to Proposal")
    @action(detail=True, methods=["post"])
    def convert(self, request, pk=None):
        lead = self.get_object()

        if lead.is_converted:
            return Response(
                {"message": "Lead already converted"},
                status=status.HTTP_400_BAD_REQUEST
            )

        proposal = Proposal.objects.create(
            lead=lead,
            name=lead.name,
            title=lead.title,
            division=lead.division,
            client=lead.client,
            email=lead.email,
            phone=lead.phone,
            remarks=lead.remarks,
        )

        lead.is_converted = True
        lead.lead_status = "Approved"
        lead.save(update_fields=["is_converted", "lead_status"])

        return Response({
            "message": "Lead converted successfully",
            "proposal_id": proposal.id
        })

    @log_status(change_type="lead", new_status="updated", comments="Lead updated")
    @action(detail=True, methods=["put"])
    def update_lead(self, request, pk=None):
        lead = self.get_object()

        if lead.is_converted:
            return Response(
                {"message": "Converted lead cannot be modified"},
                status=status.HTTP_400_BAD_REQUEST
            )

        allowed_fields = [
            "name", "title", "date", "division", "client",
            "email", "phone", "lead_status", "lead_source",
            "last_activity", "pic",
        ]

        for field in allowed_fields:
            if field in request.data:
                setattr(lead, field, request.data[field])

        lead.save()

        return Response(
            {"message": "Lead updated successfully", "lead_id": lead.id},
            status=status.HTTP_200_OK
        )

    @log_status(change_type="lead", new_status="deleted", comments="Lead deleted")
    @action(detail=True, methods=["put"])
    def delete_lead(self, request, pk=None):
        lead = self.get_object()

        if lead.is_converted:
            return Response(
                {"message": "Converted lead cannot be deleted"},
                status=status.HTTP_400_BAD_REQUEST
            )

        lead.is_deleted = True
        lead.save(update_fields=["is_deleted"])

        return Response(
            {"message": "Lead deleted successfully"},
            status=status.HTTP_200_OK
        )


class ProposalViewSet(BaseSalesViewSet):
    queryset = Proposal.objects.filter(is_deleted=False)
    serializer_class = ProposalSerializer

    @log_status(change_type="proposal", new_status="converted", comments="Proposal converted to Quotation")
    @action(detail=True, methods=["post"])
    def convert(self, request, pk=None):
        proposal = self.get_object()

        if proposal.is_converted:
            return Response(
                {"message": "Proposal already converted"},
                status=status.HTTP_400_BAD_REQUEST
            )

        quotation = Quotation.objects.create(
            proposal=proposal,
            name=proposal.name,
            title=proposal.title,
            division=proposal.division,
            client=proposal.client,
            email=proposal.email,
            phone=proposal.phone,
            remarks=proposal.remarks,
        )

        proposal.is_converted = True
        proposal.save(update_fields=["is_converted"])

        return Response({
            "message": "Proposal converted successfully",
            "quotation_id": quotation.id
        })

    @log_status(change_type="proposal", new_status="updated", comments="Proposal updated")
    @action(detail=True, methods=["put"])
    def update_proposal(self, request, pk=None):
        proposal = self.get_object()

        if proposal.is_converted:
            return Response(
                {"message": "Converted proposal cannot be modified"},
                status=status.HTTP_400_BAD_REQUEST
            )

        allowed_fields = [
            "name", "title", "date", "division", "client",
            "email", "phone", "remarks", "proposal_number", "pic_for_proposal",
        ]

        for field in allowed_fields:
            if field in request.data:
                setattr(proposal, field, request.data[field])

        if "attachment" in request.FILES:
            proposal.attachment = request.FILES["attachment"]

        proposal.save()

        return Response(
            {"message": "Proposal updated successfully", "proposal_id": proposal.id},
            status=status.HTTP_200_OK
        )



class QuotationViewSet(BaseSalesViewSet):
    queryset = Quotation.objects.filter(is_deleted=False)
    serializer_class = QuotationSerializer
    list_key = "quotations"


    @action(detail=False, methods=["get"])
    def v1(self, request):

        queryset = self.queryset.filter(version=1)

        serializer = self.get_serializer(
            queryset,
            many=True
        )

        return Response(
        {
            "success": True,
            "message": "Quotations fetched successfully",
            "data": {
                "quotations": serializer.data
            },
            "meta": {}
        }
    )


    @action(detail=False, methods=["get"])
    def v2(self, request):

        queryset = self.queryset.filter(version=2)

        serializer = self.get_serializer(
            queryset,
            many=True
        )

        return Response(
        {
            "success": True,
            "message": "Quotations fetched successfully",
            "data": {
                "quotations": serializer.data
            },
            "meta": {}
        }
    )


    @action(detail=False, methods=["get"])
    def v3(self, request):

        queryset = self.queryset.filter(version=3)

        serializer = self.get_serializer(
            queryset,
            many=True
        )

        return Response(
        {
            "success": True,
            "message": "Quotations fetched successfully",
            "data": {
                "quotations": serializer.data
            },
            "meta": {}
        }
    )
    @log_status(change_type="quotation", new_status="revised", comments="Quotation revised to next version")
    @action(detail=True, methods=["post"])
    def revise(self, request, pk=None):
        quotation = self.get_object()

        if quotation.is_converted:
            return Response(
                {"message": "Cannot revise a converted quotation"},
                status=status.HTTP_400_BAD_REQUEST
            )

        latest_version = (
            Quotation.objects
            .filter(proposal=quotation.proposal)
            .order_by("-version")
            .first()
        )

        if quotation.id != latest_version.id:
            return Response(
                {"message": f"Only latest quotation (Version {latest_version.version}) can be revised"},
                status=status.HTTP_400_BAD_REQUEST
            )

        is_converted = request.data.get("is_converted")
        if not is_converted:
            return Response(
                {"message": "is_converted is required to revise"},
                status=status.HTTP_400_BAD_REQUEST
            )

        new_quotation = Quotation.objects.create(
            proposal=quotation.proposal,
            version=quotation.version + 1,
            name=quotation.name,
            title=quotation.title,
            division=quotation.division,
            client=quotation.client,
            email=quotation.email,
            phone=quotation.phone,
            remarks=quotation.remarks,
        )

        return Response(
            {
                "message": "Quotation revised successfully",
                "quotation_id": new_quotation.id,
                "version": new_quotation.version,
            },
            status=status.HTTP_201_CREATED
        )

    @log_status(change_type="quotation", new_status="updated", comments="Quotation updated")
    @action(detail=True, methods=["put"])
    def update_quotation(self, request, pk=None):
        quotation = self.get_object()

        if quotation.is_converted:
            return Response(
                {"message": "Converted quotation cannot be edited"},
                status=status.HTTP_400_BAD_REQUEST
            )

        quotation.quotation_number = request.data.get("quotation_number", quotation.quotation_number)
        quotation.status = request.data.get("status", quotation.status)
        quotation.amount = request.data.get("amount", quotation.amount)
        quotation.remarks = request.data.get("remarks", quotation.remarks)
        quotation.save()

        return Response(
            {
                "message": "Quotation updated successfully",
                "quotation_id": quotation.id,
                "quotation_number": quotation.quotation_number,
                "version": quotation.version,
                "status": quotation.status,
                "amount": quotation.amount,
            },
            status=status.HTTP_200_OK
        )

    @log_status(change_type="quotation", new_status="phase_updated", comments="Quotation phase updated")
    @action(detail=True, methods=["put"])
    def update_phase(self, request, pk=None):
        quotation = self.get_object()
        phase = int(request.data.get("phase", 1))

        if phase not in [1, 2, 3, 4]:
            return Response(
                {"message": "Phase must be 1, 2, 3 or 4"},
                status=status.HTTP_400_BAD_REQUEST
            )

        created = []

        current = (
            Quotation.objects
            .filter(proposal=quotation.proposal)
            .order_by("-version")
            .first()
        )

        while current.version < min(phase, 3):
            current.is_converted = True
            current.save(update_fields=["is_converted"])
            next_version = current.version + 1
            current = Quotation.objects.create(
                proposal=current.proposal,
                version=next_version,
                name=current.name,
                title=current.title,
                division=current.division,
                client=current.client,
                email=current.email,
                phone=current.phone,
                remarks=current.remarks,
            )
            created.append(f"Quotation V{next_version}")

        if phase == 4:
            po_exists = PurchaseOrder.objects.filter(quotation=current).exists()
            if not po_exists:
                current.is_converted = True
                current.save(update_fields=["is_converted"])
                po = PurchaseOrder.objects.create(
                    quotation=current,
                    name=current.name,
                    title=current.title,
                    division=current.division,
                    client=current.client,
                    email=current.email,
                    phone=current.phone,
                    remarks=current.remarks,
                )
                created.append(f"Purchase Order #{po.id}")
        comments = "Purchase Order created" if phase == 4 else "Quotation phase updated"
        
        log_status_history(
            work_id=quotation.id,
            previous_status="Quotation phase updated",
            new_status=f"phase_{phase}",
            change_type="quotation",
            team_member_id=quotation.team_member_id,
            comments=comments)
        

        return Response(
            {"message": "Phase updated successfully", "current_version": current.version, "created": created},
            status=status.HTTP_200_OK
        )

    @log_status(change_type="quotation", new_status="deleted", comments="Quotation deleted")
    @action(detail=True, methods=["put"])
    def delete_quotation(self, request, pk=None):
        quotation = self.get_object()
        quotation.is_deleted = True
        quotation.save(update_fields=["is_deleted"])
        return Response({"message": "Quotation deleted successfully"})


class PurchaseOrderViewSet(BaseSalesViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
    list_key = "purchase_orders"

    @log_status(change_type="purchase_order", new_status="updated", comments="Purchase Order updated")
    @action(detail=True, methods=["put"])
    def update_purchase(self, request, pk=None):
        purchase_order = self.get_object()

        allowed_fields = ["remarks", "purchase_order_number", "amount"]

        for field in allowed_fields:
            if field in request.data:
                setattr(purchase_order, field, request.data[field])

        if "attachment" in request.FILES:
            purchase_order.attachment = request.FILES["attachment"]

        try:
            purchase_order.save()
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {
                "message": "Purchase Order updated successfully",
                "purchase_order_id": purchase_order.id,
                "purchase_order_number": purchase_order.purchase_order_number,
                "amount": purchase_order.amount,
            },
            status=status.HTTP_200_OK
        )