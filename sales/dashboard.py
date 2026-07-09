from django.db.models import Count, Sum
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models.functions import TruncWeek
from django.db.models.functions import TruncQuarter
from django.db.models import Count, Sum, Avg
from django.db.models.functions import TruncQuarter
from rest_framework.decorators import action
from rest_framework import viewsets
from works.models import Works
from sales.models import Lead, Proposal, Quotation, PurchaseOrder
from teams.models import Team
from history.models import StatusHistory

from .views import APIResponseMixin
from sales.models import Lead, Proposal, Quotation, PurchaseOrder
from teams.models import Team


class DashboardViewSet(APIResponseMixin, viewsets.ViewSet):

    @action(detail=False, methods=["get"], url_path="performance")
    def weekly_performance(self, request):
        module = request.query_params.get("module")

        if module == "lead":
            queryset = (
                Lead.objects
                .exclude(pic__isnull=True)
                .annotate(week=TruncWeek("created_at"))
                .values("week", "pic")
                .annotate(count=Count("id"))
                .order_by("week", "pic")
            )

            data = []

            for item in queryset:
                member = Team.objects.filter(
                    pk=item["pic"]
                ).values_list(
                    "member",
                    flat=True
                ).first()

                data.append({
                    "label": f"{item['week'].strftime('%Y-W%U')} - {member}",
                    "value": item["count"],
                })
        elif module == "proposal":
            queryset = (
                Proposal.objects
                .exclude(pic_for_proposal__isnull=True)
                .annotate(week=TruncWeek("created_at"))
                .values("week", "pic_for_proposal")
                .annotate(count=Count("id"))
                .order_by("week", "pic_for_proposal")
            )

            data = [
                    {
                        "label": f"{item['week'].strftime('%Y-W%U')} - {Team.objects.filter(pk=item['pic_for_proposal']).values_list('member', flat=True).first()}",
                        "value": item["count"],
                    }
                    for item in queryset
                ]

        elif module == "quotation":
            queryset = (
                Quotation.objects
                .exclude(pic__isnull=True)
                .annotate(week=TruncWeek("created_at"))
                .values("week", "pic")
                .annotate(count=Count("id"))
                .order_by("week", "pic")
            )

            data = [
                {
                    "label":f"{item["week"].strftime("%Y-W%U")}-{Team.objects.filter(pk=item['pic']).values_list('member', flat=True).first()}",
                        "value": item["count"],

                }
                for item in queryset
            ]

        elif module == "purchase":
            queryset = (
                PurchaseOrder.objects
                .exclude(pic__isnull=True)
                .annotate(quarter=TruncQuarter("created_at"))
                .values("quarter", "pic")
                .annotate(total_amount=Sum("amount"))
                .order_by("quarter", "pic")
            )

                
            data = [
                {
                    "label": f"Q{((item['quarter'].month - 1) // 3) + 1} {item['quarter'].year}-{Team.objects.filter(pk=item['pic']).values_list('member', flat=True).first()}",
                        "value": float(item["total_amount"] or 0),
                }
                for item in queryset
            ]


        else:
            return Response(
                {
                    "message": "Invalid module. Use lead, proposal, quotation or purchase."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return self.get_response(
            data={"chart_data": data},
            message=f"{module.capitalize()} weekly performance fetched successfully",
        )


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
                # "created_at": proposal.created_at,
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
                    # "created_at": quotation.created_at,
                    "converted_date": quotation.converted_date,
                })

                purchase_orders = PurchaseOrder.objects.filter(
                    Proposal=proposal
                )

                for po in purchase_orders:

                    history.append({
                        "phase": "purchase",
                        "id": po.id,
                        "purchase_order_number": po.purchase_order_number,
                        "status": po.purchase_order_status,
                        "amount": po.amount,
                        # "created_at": po.created_at,
                        "converted_date": po.converted_date,
                    })

        return self.get_response(
            data={
                "history": history
            },
            message="History fetched successfully",
        )

    @action(detail=False, methods=["get"], url_path="summary")
    def summary(self, request):

                # -------------------- Cards --------------------

                lead_card = {
                    "total": Lead.objects.count(),
                    "pending": Lead.objects.filter(
                        lead_status__iexact="Pending"
                    ).count(),
                    "converted": Lead.objects.filter(
                        is_converted=True
                    ).count(),
                    "declined": Lead.objects.filter(
                        lead_status__iexact="Declined"
                    ).count(),
                }

                proposal_card = {
                    "total": Proposal.objects.count(),
                    "pending": Proposal.objects.filter(
                        proposal_status__iexact="Pending"
                    ).count(),
                    "submitted": Proposal.objects.filter(
                        proposal_status__iexact="Submitted"
                    ).count(),
                    "approved": Proposal.objects.filter(
                        proposal_status__iexact="Approved"
                    ).count(),
                }

                quotation_card = {
                    "count": Quotation.objects.count(),
                    "total_amount": Quotation.objects.aggregate(
                        total=Sum("amount")
                    )["total"] or 0,
                    "pending": Quotation.objects.filter(
                        quotation_status__iexact="Pending"
                    ).count(),
                    "approved": Quotation.objects.filter(
                        quotation_status__iexact="Approved"
                    ).count(),
                    "declined": Quotation.objects.filter(
                        quotation_status__iexact="Declined"
                    ).count(),
                }

                purchase_card = {
                    "orders": PurchaseOrder.objects.count(),
                    "total_amount": PurchaseOrder.objects.aggregate(
                        total=Sum("amount")
                    )["total"] or 0,
                    "average_order": PurchaseOrder.objects.aggregate(
                        avg=Avg("amount")
                    )["avg"] or 0,
                }

                # -------------------- Quarter-wise Purchase Order --------------------

                quarter_summary = []

                purchase_queryset = (
                    PurchaseOrder.objects
                    .exclude(amount__isnull=True)
                    .annotate(
                        quarter=TruncQuarter("created_at")
                    )
                    .values("quarter")
                    .annotate(
                        total_orders=Count("id"),
                        total_amount=Sum("amount")
                    )
                    .order_by("quarter")
                )

                for row in purchase_queryset:

                    q = ((row["quarter"].month - 1) // 3) + 1

                    quarter_summary.append({
                        "quarter": f"Q{q}-{row['quarter'].year}",
                        "orders": row["total_orders"],
                        "amount": float(row["total_amount"] or 0)
                    })

                # -------------------- PIC Performance --------------------

                pic_summary = []

                for team in Team.objects.all():

                    lead_count = Lead.objects.filter(
                        pic=team.pk
                    ).count()

                    proposal_count = Proposal.objects.filter(
                        pic_for_proposal=team.pk
                    ).count()

                    quotation_total = (
                        Quotation.objects.filter(
                            pic=team.pk
                        ).aggregate(
                            total=Sum("amount")
                        )["total"] or 0
                    )

                    purchase_total = (
                        PurchaseOrder.objects.filter(
                            pic=team.pk
                        ).aggregate(
                            total=Sum("amount")
                        )["total"] or 0
                    )

                    if (
                        lead_count
                        or proposal_count
                        or quotation_total
                        or purchase_total
                    ):
                        pic_summary.append({
                            "pic": team.member,
                            "leads": lead_count,
                            "proposals": proposal_count,
                            "quotation_amount": float(quotation_total),
                            "purchase_order_amount": float(purchase_total)
                        })

                # -------------------- Quarter-wise PIC Performance --------------------

                pic_quarter = []

                purchase_pic_queryset = (
                    PurchaseOrder.objects
                    .exclude(pic__isnull=True)
                    .annotate(
                        quarter=TruncQuarter("created_at")
                    )
                    .values("quarter", "pic")
                    .annotate(
                        total_amount=Sum("amount"),
                        orders=Count("id")
                    )
                    .order_by("quarter", "pic")
                )

                for row in purchase_pic_queryset:

                    q = ((row["quarter"].month - 1) // 3) + 1

                    member = Team.objects.filter(
                        pk=row["pic"]
                    ).values_list(
                        "member",
                        flat=True
                    ).first()

                    pic_quarter.append({
                        "quarter": f"Q{q}-{row['quarter'].year}",
                        "pic": member,
                        "orders": row["orders"],
                        "amount": float(row["total_amount"] or 0)
                    })

                return self.get_response(
                    data={
                        "cards": {
                            "lead": lead_card,
                            "proposal": proposal_card,
                            "quotation": quotation_card,
                            "purchase_order": purchase_card
                        },
                        "quarter_summary": quarter_summary,
                        "pic_performance": pic_summary,
                        "quarter_pic_performance": pic_quarter
                    },
                    message="Dashboard fetched successfully"
                )


    @action(detail=False, methods=["get"], url_path="sales-works")
    def sales_works(self, request):

        works = Works.objects.filter(category="Sales").order_by("-id")

        team_map = dict(
            Team.objects.values_list("id", "member")
        )

        data = []

        for work in works:

            team_names = [
                team_map.get(team_id)
                for team_id in (work.team_id or [])
                if team_map.get(team_id)
            ]

            data.append({
                "id": work.id,
                "project_id": work.project_id,
                "category": work.category,
                "subcategory": work.subcategory,
                "tab": work.tab,
                "status": work.status,
                "description": work.description,
                "comments": work.comments,
                "images": work.images,
                "team": team_names,
            })

        return self.get_response(
            data={"works": data},
            message="Sales works fetched successfully",
        )

    @action(detail=False, methods=["get"], url_path="logs")
    def logs(self, request):

        module = request.query_params.get("module")

        if module == "lead":
            work_ids = Lead.objects.values_list("id", flat=True)

        elif module == "proposal":
            work_ids = Proposal.objects.values_list("id", flat=True)

        elif module == "quotation":
            work_ids = Quotation.objects.values_list("id", flat=True)

        elif module == "purchase":
            work_ids = PurchaseOrder.objects.values_list("id", flat=True)

        else:
            return Response(
                {
                    "message": "Invalid module. Use lead, proposal, quotation or purchase."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        logs = (
            StatusHistory.objects
            .filter(work_id__in=work_ids)
            .order_by("-changed_at")
        )

        team_map = dict(
            Team.objects.values_list("id", "member")
        )
        
        name_map = {}

        if module == "lead":
            name_map = dict(
                Lead.objects.filter(id__in=work_ids)
                .values_list("id", "name")
            )

        elif module == "proposal":
            name_map = dict(
                Proposal.objects.filter(id__in=work_ids)
                .values_list("id", "proposal_number")
            )

        elif module == "quotation":
            name_map = dict(
                Quotation.objects.filter(id__in=work_ids)
                .values_list("id", "quotation_number")
            )

        elif module == "purchase":
            name_map = dict(
                PurchaseOrder.objects.filter(id__in=work_ids)
                .values_list("id", "purchase_order_number")
            )

        data = [
            {
                "id": log.id,
                "work_id": log.work_id,
                "work_name": name_map.get(log.work_id),
                "previous_status": log.previous_status,
                "status": log.status,
                "change_type": log.change_type,
                "comments": log.comments,
                "team_member": team_map.get(log.team_member_id),
                "changed_at": log.changed_at,
            }
            for log in logs
        ]

        return self.get_response(
            data={"logs": data},
            message=f"{module.capitalize()} logs fetched successfully",
        )