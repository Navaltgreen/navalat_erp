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