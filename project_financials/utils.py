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
        payment_type,
        milestone,
        remarks,
        comments=None,
    ):
        PaymentHistory.objects.create(
            payment_id=payment_id,
            previous_status=previous_status or "",
            current_status=current_status or "",
            amount=amount,
            payment_type=payment_type,
            milestone=milestone,
            comments=comments,
            remarks=remarks,
            updated_at=timezone.now(),
        )