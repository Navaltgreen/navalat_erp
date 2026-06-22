from rest_framework import viewsets
from rest_framework.response import Response
from core.api_mixins import APIResponseMixin
from .models import WorkAssignment
from teams.models import Team
from works.models import Works
from projects.models import Project
from history.models import StatusHistory
from .serializers import WorkAssignmentSerializer
from datetime import datetime
from rest_framework.decorators import action
from django.utils.dateparse import parse_datetime

class WorkAssignmentViewSet(APIResponseMixin, viewsets.ModelViewSet):
    queryset = WorkAssignment.objects.all()
    serializer_class = WorkAssignmentSerializer

    def list(self, request, *args, **kwargs):
        """Get all assignments"""
        queryset = self.get_queryset()

        team_member_id = request.query_params.get('team_member_id')
        role_id = request.query_params.get('role_id')

        work_id = request.query_params.get('work_id')

        if team_member_id:
            queryset = queryset.filter(team_member_id=team_member_id)
        if work_id:
            queryset = queryset.filter(work_id=work_id)

        # Build team member lookup {id: {team_id, name, member}}
        team_lookup = {t.id: {'team_id': t.team_id, 'name': t.name, 'member': t.member} 
                    for t in Team.objects.all()}

        serializer = self.get_serializer(queryset, many=True)
        assignments = serializer.data

        # Replace team_member_id with full team member details
        for assignment in assignments:
            tid = assignment.get('team_member_id')
            team = team_lookup.get(tid)
            assignment['team_member'] = team['member'] if team else None
            del assignment['team_member_id']

        return self.get_response(
            data={"workassignment": assignments},
            message="Assignments fetched successfully"
        )

    # def create(self, request, *args, **kwargs):
    #     """Create a new assignment"""
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     return self.get_response(
    #         data=serializer.data,
    #         message="Assignment created successfully",
    #         meta={"status_code": 201}
    #     )

    def retrieve(self, request, *args, **kwargs):
        """Get a specific assignment"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.get_response(
            data=serializer.data,
            message="Assignment retrieved successfully"
        )

    def update(self, request, *args, **kwargs):
        """Update an assignment"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return self.get_response(
            data=serializer.data,
            message="Assignment updated successfully"
        )

    def destroy(self, request, *args, **kwargs):
        """Delete an assignment"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return self.get_response(
            data=None,
            message="Assignment deleted successfully"
        )

# @action(detail=False, methods=['post'], url_path='bulk-update')
    def create(self, request, *args, **kwargs):
        data = request.data.get('data', [])

        if not data:
            return self.get_response(data=None, message="No data provided", meta={"status_code": 400})

        created_list = []

        for item in data:
            work_id = item.get('work_id')
            assigned_to = item.get('assigned_to', {})
            team_member_id = assigned_to.get('id') if assigned_to else None

            instance = WorkAssignment.objects.create(
                work_id=work_id,
                team_member_id=team_member_id,
                status=item.get('status', 'Not started'),
                comments=item.get('comments'),
                assigned_date=datetime.now(),
                updated_date=datetime.now(),
                actual_date=parse_datetime(item.get('created_at')) if item.get('created_at') else None,
                updated_by=request.user.id if request.user.is_authenticated else None,
            )

            created_list.append({
                'work_id': work_id,
                'assigned_to': assigned_to.get('name'),
                'status': instance.status,
            })

        return self.get_response(
            data={"assignments": created_list},
            message="Assignments created successfully"
        )
    
    # getting team role id wise 1 or 2
    @action(detail=False, methods=['get'], url_path='assignment-summary')
    def assignmentGetting(self, request, *args, **kwargs):
        """Get all assignments"""

        role_id = request.query_params.get('role_id')
        project_id = request.query_params.get('project_id')

        team_lookup = {
            t.id: {
                'team_id': t.team_id,
                'name': t.name,
                'member': t.member
            }
            for t in Team.objects.all()
        }

        # ✅ Filter works by project_id if provided
        works_qs = Works.objects.filter(project_id=project_id) if project_id else Works.objects.none()
        project_qs = Project.objects.filter(id=project_id) if project_id else Project.objects.none()
        work_lookup = {}
        for w in works_qs:
            work_lookup[w.id] = {
                field.name: getattr(w, field.name)
                for field in w._meta.fields
            }
        # ✅ Build project lookup
        project_lookup = {}
       
        for p in project_qs:
            project_lookup[p.id] = {
                field.name: getattr(p, field.name)
                for field in p._meta.fields
            }
        queryset = self.get_queryset().none()

        if role_id == '1':
            # ✅ Filter assignments to only those belonging to the filtered works
            if project_id:
                queryset = self.queryset.filter(work_id__in=work_lookup.keys())
                

        else:
            return self.get_response(
                data=None,
                message="Invalid role_id",
                meta={"status_code": 400}
            )

        serializer = self.get_serializer(queryset, many=True)
        assignments = serializer.data

        for assignment in assignments:
            tid = assignment.get('team_member_id')
            team = team_lookup.get(tid)
            assignment['team_member'] = team['member'] if team else None
            assignment.pop('team_member_id', None)
            work_id = assignment.get('work_id')
            work = work_lookup.get(work_id)
            assignment['project_id'] = work['project_id'] if work else None
            proj = project_qs.first()
            assignment['project_name'] = proj.name if proj else None
            assignment['description'] = work['description'] if work else None
            assignment['category'] = work['category'] if work else None
            assignment['subcategory'] = work['subcategory'] if work else None
            assignment['tab'] = work['tab'] if work else None

        return self.get_response(
            data={"workassignment": assignments},
            message="Assignments fetched successfully"
        )
    @action(detail=False, methods=['post'], url_path='fake')
    def update_team_member(self, request, *args, **kwargs):
        """Update assignments"""

        payload = request.data.get('data', [])
        if not payload:
            return self.get_response(
                data=None,
                message="No data provided",
                meta={"status_code": 400}
            )

        updated = []
        for item in payload:
            work_id = item.get('work_id')
            assigned_to = item.get('assigned_to', {})
            team_member_id = assigned_to.get('id')

            if not work_id:
                continue

            # ── Work model update ──────────────────────────────────────
            try:
                work = Works.objects.get(id=work_id)
            except Works.DoesNotExist:
                continue

            work_fields = ['project_id', 'category', 'subcategory', 'tab', 'description']
            for field in work_fields:
                if field in item:
                    setattr(work, field, item[field])

            work.save()

            # ── WorkAssignment model update ────────────────────────────
            try:
                assignment = WorkAssignment.objects.get(work_id=work_id,team_member_id=team_member_id)
            except WorkAssignment.DoesNotExist:
                continue

            if 'assigned_to' in item:
                assignment.team_member_id = item['assigned_to'].get('id')

            if 'status' in item:
                assignment.status = item['status']

            if 'comments' in item:
                assignment.comments = item['comments']

            # assignment.updated_by = (
            #     request.user.id
            #     if request.user.is_authenticated
            #     else None
            # )
            if 'updated_by' in item:
                assignment.updated_by = item['updated_by']

            assignment.save()
            updated.append({
                "work_id": work_id,
                "category": work.category,
                "subcategory": work.subcategory,
                "description": work.description,
                "status": assignment.status,
                "comments": assignment.comments,
                "team_member_id": assignment.team_member_id,
            })

        return self.get_response(
            data={"assignments": updated},
            message="Assignments updated successfully"
        )
    
    @action(detail=False, methods=['post'], url_path='update-team-member')
    def update_team_member(self, request, *args, **kwargs):
        """Update assignments"""

        payload = request.data.get('data', [])
        if not payload:
            return self.get_response(
                data=None,
                message="No data provided",
                meta={"status_code": 400}
            )

        updated = []
        history_entries = []
        for item in payload:
            work_id = item.get('work_id')
            assigned_to = item.get('assigned_to', {})
            team_member_id = assigned_to.get('id')

            if not work_id:
                continue

            # ── Work model update ──────────────────────────────────────
            try:
                work = Works.objects.get(id=work_id)
            except Works.DoesNotExist:
                continue

            work_fields = ['project_id', 'category', 'subcategory', 'tab', 'description']
            for field in work_fields:
                if field in item:
                    setattr(work, field, item[field])

            work.save()

            # ── WorkAssignment model update ────────────────────────────
            try:
                assignment = WorkAssignment.objects.get(work_id=work_id,team_member_id=team_member_id)
            except WorkAssignment.DoesNotExist:
                continue
            previous_status = assignment.status  # ✅ capture before overwrite
            new_status = item.get('status', assignment.status)

            if 'assigned_to' in item:
                change_type='assigned_to'

                assignment.team_member_id = item['assigned_to'].get('id')

            if 'status' in item:
                assignment.status = item['status']

            if 'comments' in item:
                change_type='comments'

                assignment.comments = item['comments']

            # assignment.updated_by = (
            #     request.user.id
            #     if request.user.is_authenticated
            #     else None
            # )
            if 'updated_by' in item:
                change_type='updated_by'
                
                assignment.updated_by = item['updated_by']
            if 'status' in item and previous_status != new_status:
                change_type='status_update'
                history_entries.append(
                    StatusHistory(
                        work_id=work_id,
                        previous_status=previous_status,
                        status=new_status,
                        comments=item.get('comments'),
                        team_member_id=team_member_id,
                        change_type=change_type,   # or pass from frontend
                        changed_at=datetime.now(),
                    )
                )
            assignment.save()
            if history_entries:
                StatusHistory.objects.bulk_create(history_entries)

            updated.append({
                "work_id": work_id,
                "category": work.category,
                "subcategory": work.subcategory,
                "description": work.description,
                "status": assignment.status,
                "comments": assignment.comments,
                "team_member_id": assignment.team_member_id,
            })

        return self.get_response(
            data={"assignments": updated},
            message="Assignments updated successfully"
        )