from django.db.models import Count, Sum
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .views import APIResponseMixin
from sales.models import Lead, Proposal, Quotation, PurchaseOrder
from teams.models import Team


class DashboardViewSet(APIResponseMixin, viewsets.ViewSet):

    @action(detail=False, methods=["get"], url_path="performance")
    def performance(self, request):
        module = request.query_params.get("module")
        if module == "lead":
            queryset = (
                Lead.objects
                .exclude(pic__isnull=True)
                .values("pic")
                .annotate(total=Count("id"))
                .order_by("-total")
            )

            data = [
                {
                    "label": Team.objects.filter(pk=item["pic"]).values_list("member", flat=True).first(),
                    "value": item["total"],
                }
                for item in queryset
            ]

        elif module == "proposal":
            queryset = (
                Proposal.objects
                .exclude(pic_for_proposal__isnull=True)
                .values("pic_for_proposal")
                .annotate(total=Count("id"))
                .order_by("-total")
            )

            data = [
                {
                    "label": Team.objects.filter(pk=item["pic_for_proposal"]).values_list("member", flat=True).first(),
                    "value": item["total"],
                }
                for item in queryset
            ]

        elif module == "quotation":
            queryset = (
                Quotation.objects
                .exclude(pic__isnull=True)
                .values("pic")
                .annotate(
                    total=Count("id"),
                    amount=Sum("amount")
                )
                .order_by("-total")
            )

            data = [
                {
                    "label": Team.objects.filter(pk=item["pic"]).values_list("member", flat=True).first(),
                    "value": item["total"],
                }
                for item in queryset
            ]

        elif module == "purchase":
            queryset = (
                PurchaseOrder.objects
                .exclude(pic__isnull=True)
                .values("pic")
                .annotate(
                    total=Count("id"),
                    amount=Sum("amount")
                )
                .order_by("-total")
            )

            data = [
                {
                    "label": Team.objects.filter(pk=item["pic"]).values_list("member", flat=True).first(),
                    "value": item["total"],
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
            message=f"{module.capitalize()} performance fetched successfully",
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