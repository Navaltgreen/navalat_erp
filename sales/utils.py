from history.models import StatusHistory
from django.utils import timezone
import os
import uuid
import functools

from django.conf import settings
from django.core.files.storage import FileSystemStorage
from core.api_mixins import APIResponseMixin

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import viewsets
from history.models import StatusHistory
from django.utils import timezone
import os
import uuid
import functools

from django.conf import settings
from django.core.files.storage import FileSystemStorage
from core.api_mixins import APIResponseMixin

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import viewsets


class StatusLogger:
    """
    Reusable status logging utility.
    Use directly: StatusLogger.log(...)
    Use as decorator: @StatusLogger.track(...)
    """

    @staticmethod
    def get_team_member_id(request):
        try:
            from auth_core.models import ERPUser
            sub = getattr(request.user, "sub", None)
            if sub:
                erp_user = ERPUser.objects.get(sub=sub)
                return erp_user.team_member_id
            return None
        except Exception:
            return None

    # @staticmethod
    # def log_status_history(
    #     work_id,
    #     previous_status,
    #     new_status,
    #     change_type,
    #     team_member_id=None,
    #     comments=None,
    # ):
    #     StatusHistory.objects.create(
    #         work_id=work_id,
    #         previous_status=previous_status or "",
    #         status=new_status or "",
    #         change_type=change_type,
    #         team_member_id=team_member_id,
    #         comments=comments,
    #         changed_at=timezone.now(),
    #     )

    @staticmethod
    def log_status_change(change_type, status_field, comments=None, work_id_field=None):
        """
        Decorator for viewset update actions. Logs to StatusHistory
        ONLY if the given status_field actually changed value.

        Usage:
            @StatusLogger.log_status_change(change_type="lead", status_field="lead_status")
            @action(detail=True, methods=["put"])
            def update_lead(self, request, pk=None):
                ...

            @StatusLogger.log_status_change(change_type="proposal", status_field="proposal_status")
            @action(detail=True, methods=["put"])
            def update_proposal(self, request, pk=None):
                ...
        """
        def decorator(func):
            @functools.wraps(func)
            def wrapper(self, request, *args, **kwargs):
                obj = self.get_object()
                previous_status = getattr(obj, status_field, None)
                work_id = getattr(obj, work_id_field, obj.id) if work_id_field else obj.id

                response = func(self, request, *args, **kwargs)

                if response.status_code < 300:
                    obj.refresh_from_db()   # pull the saved value after func ran
                    new_status = getattr(obj, status_field, None)

                    if new_status != previous_status:
                        team_member_id = StatusLogger.get_team_member_id(request) or None
                        StatusLogger.log_status_history(
                            work_id=work_id,
                            previous_status=previous_status,
                            new_status=new_status,
                            change_type=change_type,
                            team_member_id=team_member_id,
                            comments=comments,
                        )

                return response
            return wrapper
        return decorator

# def get_team_member_id_from_request(request):
#     print("user",request.user)           # Django user object
#     print("auth",request.auth)           # raw token
#     print(request.META)           # all headers
#     try:
#         from auth_core.models import ERPUser  # adjust app name if different
#         sub = getattr(request.user, "sub", None)
#         if sub:
#             erp_user = ERPUser.objects.get(sub=sub)
#             return erp_user.team_member_id
#         return None
#     except Exception:
#         return None
# def log_status_history(
#     work_id,
#     previous_status,
#     new_status,
#     change_type,
#     team_member_id=None,
#     comments=None,
# ):
#     StatusHistory.objects.create(
#         work_id=work_id,
#         previous_status=previous_status or "",
#         status=new_status or "",
#         change_type=change_type,
#         team_member_id=team_member_id,
#         comments=comments,
#         changed_at=timezone.now(),
#     )


# def log_status(change_type, new_status, comments=None):
#     """
#     Decorator that captures previous status before the action runs,
#     then logs to StatusHistory after it completes successfully.

#     Usage:
#         @log_status(change_type="lead", new_status="converted", comments="Lead converted")
#         def convert(self, request, pk=None):
#             ...
#     """
#     def decorator(func):
#         @functools.wraps(func)
#         def wrapper(self, request, *args, **kwargs):
#             is_create = func.__name__ == "create"
#             # --- capture state BEFORE action runs ---
#             obj = self.get_object()
            
#             # previous_status = (
#             #     obj.lead_status
#             #     if hasattr(obj, "lead_status")
#             #     else ("converted" if obj.is_converted else "not converted")
#             # )

#             # work_id = obj.id
#             if not is_create:
#                 obj = self.get_object()
#                 previous_status = (
#                     obj.lead_status
#                     if hasattr(obj, "lead_status")
#                     else ("converted" if obj.is_converted else "not converted")
#                 )
#                 work_id = obj.id
#             # prefer token-based team_member_id, fallback to obj field
#             team_member_id = (
#                 get_team_member_id_from_request(request)
#                 or (obj.team_member_id if not is_create else None)
#             )


#             # --- run the actual action ---
#             response = func(self, request, *args, **kwargs)

#             # --- log only on success (2xx) ---
#             if response.status_code < 300:
#                 log_status_history(
#                     work_id=work_id,
#                     previous_status=previous_status,
#                     new_status=new_status,
#                     change_type=change_type,
#                     team_member_id=team_member_id,
#                     comments=comments,
#                 )

#             return response

#         return wrapper
#     return decorator


class FileUploadViewSet(APIResponseMixin, viewsets.ViewSet):
    parser_classes = (MultiPartParser, FormParser)

    @action(detail=False, methods=["post"], url_path="image")
    def upload_image(self, request):

        image = request.FILES.get("image")

        if not image:
            return Response(
                {
                    "message": "No image provided."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        upload_dir = os.path.join(settings.BASE_DIR, "static", "uploads")
        os.makedirs(upload_dir, exist_ok=True)

        ext = os.path.splitext(image.name)[1]
        filename = f"{uuid.uuid4().hex}{ext}"

        storage = FileSystemStorage(
            location=upload_dir,
            base_url="/static/uploads/"
        )

        saved_name = storage.save(filename, image)

        image_url = request.build_absolute_uri(
            storage.url(saved_name)
        )

        return self.get_response(
            data={
                "filename": saved_name,
                "url": image_url,
            },
            message="Image uploaded successfully",)





