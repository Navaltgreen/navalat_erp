from rest_framework import viewsets
from rest_framework.response import Response
from core.api_mixins import APIResponseMixin
from .models import Works
from projects.models import Project

from .serializers import WorkSerializer


class WorkViewSet(APIResponseMixin, viewsets.ModelViewSet):
    queryset = Works.objects.all()
    serializer_class = WorkSerializer

    # def list(self, request, *args, **kwargs):
    #     """Get all issues"""
    #     queryset = self.get_queryset()
    #     serializer = self.get_serializer(queryset, many=True)
    #     return self.get_response(
    #         data=serializer.data,
    #         message="Works fetched successfully"
    #     )
    def list(self, request, *args, **kwargs):
        """Get all works — filter by project_id if provided"""
        project_id = request.query_params.get('project_id')

        fields = ['id', 'project_id', 'category', 'subcategory', 'tab', 'status', 'images', 'description', 'comments', 'team_id','created_at','created_by','updated_at','updated_by']

        if project_id:
            queryset = Works.objects.filter(project_id=project_id)
        else:
            queryset = Works.objects.all()

        # Get project names lookup {id: name}
        project_ids = queryset.values_list('project_id', flat=True).distinct()
        project_lookup = {p.id: p.name for p in Project.objects.filter(id__in=project_ids)}

        work_list = []
        for work in queryset.values(*fields):
            work['project_name'] = project_lookup.get(work['project_id'], None)
            work_list.append(work)

        return self.get_response(data={"works": work_list}, message="Works fetched successfully")
    def create(self, request, *args, **kwargs):
        """Create a new Work"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return self.get_response(
            data=serializer.data,
            message="Works created successfully",
            meta={"status_code": 201}
        )

    def retrieve(self, request, *args, **kwargs):
        """Get a specific issue"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.get_response(
            data={"work":serializer.data},
            message="Work retrieved successfully"
        )

    def update(self, request, *args, **kwargs):
        """Update an Work"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return self.get_response(
            data=serializer.data,
            message="Work updated successfully"
        )

    def destroy(self, request, *args, **kwargs):
        """Delete an issue"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return self.get_response(
            data=None,
            message="Work deleted successfully"
        )

