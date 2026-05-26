from rest_framework import viewsets
from rest_framework.response import Response
from core.api_mixins import APIResponseMixin
from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(APIResponseMixin, viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def list(self, request, *args, **kwargs):
        """Get all projects"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return self.get_response(
            data={"projects": serializer.data},
            message="Projects fetched successfully"
        )
    def create(self, request, *args, **kwargs):

        data = request.data.copy()

        # remap fields
        name = data.get("project_name")
        tab = data.get("modules", [])
        if not tab:
            tab = data.get("tabs", [])
        team_id = data.get("team_id", [])
        category = data.get("category", [])
        subcategory = data.get("subcategory", [])
        client_id = data.get("client_id")
        project = Project.objects.create(
            name=name,
            client_id=client_id,
            team_id=team_id,
            tab=tab,
            category=category,
            subcategory=subcategory
        )

        serializer = self.get_serializer(project)

        return self.get_response(
            data=serializer.data,
            message="Project created successfully",
            meta={"status_code": 201}
        )
    
    
    def retrieve(self, request, *args, **kwargs):
        """Get a specific project"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.get_response(
            data=serializer.data,
            message="Project retrieved successfully"
        )

    def update(self, request, *args, **kwargs):
        """Update a project"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return self.get_response(
            data=serializer.data,
            message="Project updated successfully"
        )

    def destroy(self, request, *args, **kwargs):
        """Delete a project"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return self.get_response(
            data=None,
            message="Project deleted successfully"
        )

