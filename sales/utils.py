from history.models import StatusHistory
from django.utils import timezone


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