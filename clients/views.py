from rest_framework import viewsets
from rest_framework.response import Response
from core.api_mixins import APIResponseMixin
from .models import Client
from .serializers import ClientSerializer, ClientDetailSerializer
from projects.models import Project


class ClientViewSet(APIResponseMixin, viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

    def list(self, request, *args, **kwargs):
        """Get all clients - simple list"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return self.get_response(
            data={"clients": serializer.data},
            message="Clients fetched successfully"
        )

    def create(self, request, *args, **kwargs):
        """Create a new client"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        print("Validated data:", serializer.validated_data)  # Debugging line
        self.perform_create(serializer)

        return self.get_response(
            data=serializer.data,
            message="Client created successfully",
            meta={"status_code": 201}
        )

    def retrieve(self, request, *args, **kwargs):
        """Get a specific client"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.get_response(
            data=serializer.data,
            message="Client retrieved successfully"
        )

    def update(self, request, *args, **kwargs):
        """Update a client"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return self.get_response(
            data=serializer.data,
            message="Client updated successfully"
        )

    def destroy(self, request, *args, **kwargs):
        """Delete a client"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return self.get_response(
            data=None,
            message="Client deleted successfully"
        )

