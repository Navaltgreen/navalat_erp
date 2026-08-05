from rest_framework.routers import DefaultRouter
from .views import (
    MilestoneViewSet,
    PaymentHistoryViewSet
)

router = DefaultRouter()
router.register("milestones", MilestoneViewSet, basename="milestone")
router.register(r'payment-history', PaymentHistoryViewSet, basename='payment-history')

urlpatterns = router.urls