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

def log_status_history(
    work_id,
    previous_status,
    new_status,
    change_type,
    team_member_id=None,
    comments=None,
):
    StatusHistory.objects.create(
        work_id=work_id,
        previous_status=previous_status or "",
        status=new_status or "",
        change_type=change_type,
        team_member_id=team_member_id,
        comments=comments,
        changed_at=timezone.now(),
    )


def log_status(change_type, new_status, comments=None):
    """
    Decorator that captures previous status before the action runs,
    then logs to StatusHistory after it completes successfully.

    Usage:
        @log_status(change_type="lead", new_status="converted", comments="Lead converted")
        def convert(self, request, pk=None):
            ...
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(self, request, *args, **kwargs):

            # --- capture state BEFORE action runs ---
            obj = self.get_object()

            previous_status = (
                obj.lead_status
                if hasattr(obj, "lead_status")
                else ("converted" if obj.is_converted else "not converted")
            )

            work_id = obj.id
            team_member_id = obj.team_member_id

            # --- run the actual action ---
            response = func(self, request, *args, **kwargs)

            # --- log only on success (2xx) ---
            if response.status_code < 300:
                log_status_history(
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





