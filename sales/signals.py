# sales/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Lead
from works.models import Works


@receiver(post_save, sender=Lead)
def create_work_entry_for_lead(sender, instance, created, **kwargs):
    if created:  # only fires when a NEW Lead is created, not on updates
        Works.objects.create(
            project_id=instance.id,    # lead id as project_id
            category="Sales",
            subcategory="Lead",
            tab="Leads",
            status="Pending",
            description=f"Lead created",
            team_id=100,
            created_by=None,
        )