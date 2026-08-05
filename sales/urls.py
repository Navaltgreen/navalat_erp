from rest_framework.routers import DefaultRouter
from .utils import FileUploadViewSet
from .dashboard import DashboardViewSet
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
router.register("upload", FileUploadViewSet, basename="upload")
router.register("dashboard", DashboardViewSet, basename="dashboard")

urlpatterns = router.urls