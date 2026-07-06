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
import openpyxl
import os
from django.shortcuts import get_object_or_404

from .utils import log_status_history

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from core.api_mixins import APIResponseMixin

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
from teams.models import Team
from rest_framework.views import APIView
from clients.models import Client
from rest_framework.viewsets import ViewSet
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

    @action(detail=True, methods=["post"])
    def convert(self, request, pk=None):
        lead = self.get_object()
        previous_status = lead.lead_status 
        if lead.is_converted:
            return Response(
                {"message": "Lead already converted"},
                status=status.HTTP_400_BAD_REQUEST
            )
        elif not request.data.get('is_converted') and request.data.get('lead_status')=='Declined':
            lead.lead_status='Declined'
            lead.save(update_fields=['is_converted','lead_status'])
            log_status_history(
            work_id=lead.id,
            previous_status=previous_status,
            new_status=lead.lead_status,
            change_type="lead_status",
            team_member_id=lead.team_member_id,
            comments="Lead created" )
            return Response({
                "message": "Lead Declined successfully"
            })
        else:
           
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
            lead.lead_status='Approved'
            lead.save(update_fields=['is_converted','lead_status'])
            # print(previous_status)
            if lead.lead_status != previous_status:
                log_status_history(
                work_id=lead.id,
                previous_status=previous_status,
                new_status=lead.lead_status,
                change_type="lead",
                team_member_id=lead.team_member_id,
                comments="Lead created"
            )

            return Response({
                "message": "Lead converted successfully",
                "proposal_id": proposal.id
            })



# decline of a lead here.
    @action(detail=True, methods=["put"])
    def update_lead(self, request, pk=None):

        lead = self.get_object()
        previous_status = lead.lead_status

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

        # Handle PIC separately
        if "pic" in request.data:
            team = get_object_or_404(Team, pk=request.data["pic"])
            lead.pic = team.id      # or team.name, depending on what you want to store

        lead.save()

        log_status_history(
            work_id=lead.id,
            previous_status=previous_status,
            new_status=lead.lead_status,
            change_type="lead_status",
            team_member_id=lead.team_member_id,
            comments="Lead updated"
        )

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

    @action(detail=False, methods=["post"], url_path="bulk_insert")
    def bulk_insert(self, request):
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        SYSTEM_API_DIR = os.path.normpath(os.path.join(BASE_DIR, ".."))
        file_path = os.path.join(SYSTEM_API_DIR, "CRM_draft1_29.06.26.xlsx")

        if not os.path.exists(file_path):
            return Response(
                {"message": "Excel file not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        created_count = 0
        failed_rows = []

        wb = openpyxl.load_workbook(file_path, read_only=True, data_only=True)
        ws = wb["Leads"]
        rows = ws.iter_rows(values_only=True)
        raw_headers = next(rows)
        headers = [h.strip() if isinstance(h, str) else h for h in raw_headers]

        for i, row in enumerate(rows, start=1):
            try:
                row_dict = dict(zip(headers, row))

                Lead.objects.create(
                    name=row_dict.get("Name"),
                    title=row_dict.get("Title"),
                    division=row_dict.get("Division"),
                    client=row_dict.get("Client"),
                    email=row_dict.get("Email"),
                    phone=row_dict.get("Phone"),
                    lead_status = row_dict.get("Lead status"),
                    pic=row_dict.get("PIC"),
                    is_converted=True,
                )
                # if 
                # Proposal.objects.create(
                #     name=row_dict.get("Name"),
                #     title=row_dict.get("Title"),
                #     division=row_dict.get("Division"),
                #     client=row_dict.get("Client"),
                #     email=row_dict.get("Email"),
                #     phone=row_dict.get("Phone"),
                #     is_converted=False,
                # )
                created_count += 1

            except Exception as e:
                failed_rows.append({"row": i, "error": str(e)})

        wb.close()

        return Response(
            {
                "message": "Bulk insert completed",
                "created": created_count,
                "failed": len(failed_rows),
                "errors": failed_rows,
            },
            status=status.HTTP_200_OK
        )

    
class ProposalViewSet(BaseSalesViewSet):
    queryset = Proposal.objects.filter()
    serializer_class = ProposalSerializer

    @action(detail=True, methods=["post"])
    def convert(self, request, pk=None):

        proposal = self.get_object()

        if proposal.is_converted:
            return Response(
                {"message": "Proposal already converted"},
                status=status.HTTP_400_BAD_REQUEST
            )
        elif not request.data.get('is_converted') and request.data.get('proposal_status')=='Declined':
            proposal.proposal_status='Declined'
            proposal.save(update_fields=['is_converted','proposal_status'])
            previous_status = proposal.proposal_status 
            log_status_history(
            work_id=proposal.id,
            previous_status=previous_status,
            new_status=proposal.proposal_status,
            change_type="proposal_status",
            team_member_id=proposal.team_member_id,
            comments="Proposal created"
        )
            return Response({
                "message": "Proposal Declined successfully",
            })
        quotation = Quotation.objects.create(
            proposal=proposal,
            name=proposal.name,
            title=proposal.title,
            division=proposal.division,
            client=proposal.client,
            remarks=proposal.remarks,
        )

        proposal.is_converted = True
        proposal.proposal_status ='Approved'
        proposal.save(update_fields=["is_converted","proposal_status"])

        return Response({
            "message": "Proposal converted successfully",
            "quotation_id": quotation.id
        })


    @action(detail=True, methods=["put"])
    def update_proposal(self, request, pk=None):
        check = request.query_params.get("check")

        proposal = self.get_object()

        if proposal.is_converted:
            return Response(
                {"message": "Converted proposal cannot be modified"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if check=='proposal_number' and "proposal_number" in request.data:
            proposal_number = request.data["proposal_number"]

            if proposal_number:
                exists = (
                    Proposal.objects.filter(
                        proposal_number=proposal_number
                    )
                    .exclude(pk=proposal.pk)
                    .exists()
                )

                if exists:
                    return Response(
                        {
                            "check": True
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                else:
                    return Response(
                        {
                            "check": False
                        },
                        status=status.HTTP_200_OK,
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
        if "pic" in request.data:
            team = get_object_or_404(Team, pk=request.data["pic"])
            proposal.pic_for_proposal = team.id      # or team.name, depending on what you want to store


        # if "attachment" in request.FILES:
        #     proposal.attachment = request.FILES["attachment"]

        proposal.save()

        return Response(
            {
                "message": "Proposal updated successfully",
                "proposal_id": proposal.id
            },
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


    @action(detail=True, methods=["post"])
    def revise(self, request, pk=None):
        """
        Create next quotation version.
        Example:
        V1 -> V2
        V2 -> V3
        """

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
                {
                    "message": (
                        f"Only latest quotation "
                        f"(Version {latest_version.version}) "
                        f"can be revised"
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        is_converted = request.data.get("is_converted")
        if is_converted:
            new_quotation = Quotation.objects.create(
                proposal=quotation.proposal,
                version=quotation.version + 1,
                name=quotation.name,
                title=quotation.title,
                division=quotation.division,
                client=quotation.client,
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
            "attachment"
        ]

        for field in allowed_fields:
            if field in request.data:
                setattr(
                    quotation,
                    field,
                    request.data[field]
                )

        if "pic" in request.data:
            team = get_object_or_404(Team, pk=request.data["pic"])
            quotation.pic = team.id

        # if "attachment" in request.FILES:
        #     quotation.attachment = request.FILES["attachment"]

        quotation.save()

        return Response(
            {
                "message": "Quotation updated successfully",
                "quotation_id": quotation.id,
                "quotation_number": quotation.quotation_number,
                "version": quotation.version,
                "status": quotation.status,
                "amount": quotation.amount,
                "pic": quotation.pic,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["put"])
    def update_phase(self, request, pk=None):
        quotation = self.get_object()

        phase = int(request.data.get("phase", 1))
        quotation_status = request.data.get("quotation_status")
        is_converted = request.data.get("is_converted")

        # -------------------------
        # Decline Quotation
        # -------------------------
        if not is_converted and quotation_status == "Declined":

            previous_status = quotation.quotation_status

            quotation.quotation_status = "Declined"
            quotation.is_converted = False
            quotation.save(update_fields=["quotation_status", "is_converted"])

            log_status_history(
                work_id=quotation.id,
                previous_status=previous_status,
                new_status="Declined",
                change_type="quotation_status",
                team_member_id=quotation.team_member_id,
                comments="Quotation declined",
            )

            return Response(
                {
                    "message": "Quotation declined successfully"
                },
                status=status.HTTP_200_OK,
            )

        # -------------------------
        # Validate phase
        # -------------------------
        if phase not in [1, 2, 3, 4]:
            return Response(
                {"message": "Phase must be 1, 2, 3 or 4"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        created = []

        # -------------------------
        # Always work with latest quotation
        # -------------------------
        current = (
            Quotation.objects.filter(proposal=quotation.proposal)
            .order_by("-version")
            .first()
        )

        # -------------------------
        # Create missing quotation versions
        # -------------------------
        while current.version < min(phase, 3):

            previous_status = current.quotation_status

            current.is_converted = True
            current.quotation_status = f"Moved to Phase {current.version + 1}"
            current.save(update_fields=["is_converted", "quotation_status"])

            log_status_history(
                work_id=current.id,
                previous_status=previous_status,
                new_status=current.quotation_status,
                change_type="quotation_status",
                team_member_id=current.team_member_id,
                comments=f"Converted to Quotation V{current.version + 1}",
            )

            next_version = current.version + 1

            current = Quotation.objects.create(
                proposal=current.proposal,
                version=next_version,
                name=current.name,
                title=current.title,
                division=current.division,
                client=current.client,
                remarks=current.remarks,
            )

            # History for newly created quotation
            log_status_history(
                work_id=current.id,
                previous_status=None,
                new_status="Created",
                change_type="quotation_status",
                team_member_id=current.team_member_id,
                comments=f"Quotation V{current.version} created",
            )

            created.append(f"Quotation V{next_version}")

        # -------------------------
        # Phase 4 -> Purchase Order
        # -------------------------
        if phase == 4:

            po = PurchaseOrder.objects.filter(
                quotation=current
            ).first()

            if not po:

                previous_status = current.quotation_status

                current.is_converted = True
                current.quotation_status = "Converted to Purchase Order"
                current.save(update_fields=["is_converted", "quotation_status"])

                log_status_history(
                    work_id=current.id,
                    previous_status=previous_status,
                    new_status=current.quotation_status,
                    change_type="quotation_status",
                    team_member_id=current.team_member_id,
                    comments="Converted to Purchase Order",
                )

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

                # Purchase Order history
                log_status_history(
                    work_id=po.id,
                    previous_status=None,
                    new_status="Created",
                    change_type="purchase_order_status",
                    team_member_id=current.team_member_id,
                    comments="Purchase Order created from quotation",
                )

                created.append(f"Purchase Order #{po.id}")

        return Response(
            {
                "message": "Phase updated successfully",
                "current_version": current.version,
                "created": created,
            },
            status=status.HTTP_200_OK,
        )
    

    @action(detail=True, methods=["put"])
    def delete_quotation(self, request, pk=None):

        quotation = self.get_object()

        quotation.is_deleted = True
        quotation.save(update_fields=["is_deleted"])

        return Response({
            "message": "Quotation deleted successfully"
    })

    
class PurchaseOrderViewSet(BaseSalesViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
    list_key = "purchase_orders"

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