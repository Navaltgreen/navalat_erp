from history.models import StatusHistory
from django.utils import timezone
import os
import uuid

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
    """
    Creates a StatusHistory entry.
    Call this from any POST/PUT action where status changes.
    """
    StatusHistory.objects.create(
        work_id=work_id,
        previous_status=previous_status or "",
        status=new_status or "",
        change_type=change_type,
        team_member_id=team_member_id,
        comments=comments,
        changed_at=timezone.now(),
    )



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





