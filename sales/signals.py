# sales/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Lead, Proposal
from .utils import StatusLogger
from works.models import Works

@receiver(post_save, sender=Proposal)
def create_work_entry_for_proposal(sender, instance, created, **kwargs):
    if created:  # only fires when a NEW Proposal is created, not on updates
        work = Works.objects.create(
            project_id=instance.id,          # proposal id as project_id
            category="Sales",
            subcategory="Proposal",
            tab="Proposals",
            status="Pending",
            description=f"Proposal created for Lead #{instance.lead_id}",
            team_id=100,
            created_by=None,
        )

        # # Only create a WorkAssignment if a PIC was actually set on the proposal
        # if instance.pic_for_proposal:
        #     WorkAssignment.objects.create(
        #         work_id=work.id,
        #         assigned_date=timezone.now(),
        #         status="Assigned",
        #         team_member_id=instance.pic_for_proposal,   #here is the problem
        #         comments=f"Auto-assigned on proposal creation (Proposal #{instance.id})",
        #         created_by=None,
        #     )