from history.models import StatusHistory
from django.utils import timezone
import functools


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