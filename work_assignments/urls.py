from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.WorkAssignmentViewSet, basename='workassignments')

urlpatterns = [
    path('', include(router.urls)),
]

