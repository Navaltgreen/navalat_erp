from history.models import StatusHistory
from django.utils import timezone
from .models import PaymentHistory

class PaymentHistoryLogger: 
    @staticmethod 
    def log_payment_history(
        payment_id,
        previous_status,
        current_status,
        amount,
        type,
        comments=None,
    ):
        PaymentHistory.objects.create(
            payment_id=payment_id,
            previous_status=previous_status or "",
            current_status=current_status or "",
            amount=amount,
            type=type,
            comments=comments,
            updated_at=timezone.now(),
        )