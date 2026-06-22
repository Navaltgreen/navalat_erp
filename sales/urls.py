from rest_framework.routers import DefaultRouter

from .views import (
    LeadViewSet,
    ProposalViewSet,
    QuotationViewSet,
    PurchaseOrderViewSet,
)

router = DefaultRouter()

router.register("leads", LeadViewSet)
router.register("proposals", ProposalViewSet)
router.register("quotations", QuotationViewSet)
router.register("purchase", PurchaseOrderViewSet)

urlpatterns = router.urls