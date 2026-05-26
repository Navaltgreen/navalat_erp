from rest_framework import viewsets
from rest_framework.response import Response
from core.api_mixins import APIResponseMixin
from .models import StatusHistory
from .serializers import HistorySerializer


class HistoryViewSet(APIResponseMixin, viewsets.ModelViewSet):
    queryset = StatusHistory.objects.all()
    serializer_class = HistorySerializer

    def list(self, request, *args, **kwargs):
        """Get all history records"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return self.get_response(
            data=serializer.data,
            message="History records fetched successfully"
        )

    def create(self, request, *args, **kwargs):
        """Create a new history record"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return self.get_response(
            data=serializer.data,
            message="History record created successfully",
            meta={"status_code": 201}
        )

    def retrieve(self, request, *args, **kwargs):
        """Get a specific history record"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.get_response(
            data=serializer.data,
            message="History record retrieved successfully"
        )

    def update(self, request, *args, **kwargs):
        """Update a history record"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return self.get_response(
            data=serializer.data,
            message="History record updated successfully"
        )

    def destroy(self, request, *args, **kwargs):
        """Delete a history record"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return self.get_response(
            data=None,
            message="History record deleted successfully"
        )

