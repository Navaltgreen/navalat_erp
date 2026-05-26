from django.db import models


class StatusHistory(models.Model):
    work_id = models.IntegerField(null=True, blank=True)
    previous_status = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    comments = models.TextField(null=True, blank=True)
    team_member_id = models.IntegerField(null=True, blank=True)
    change_type = models.CharField(max_length=50, null=True, blank=True)
    changed_at = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Status change: {self.previous_status} -> {self.status}"
