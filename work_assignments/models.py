from django.db import models


class WorkAssignment(models.Model):
    # issue_id = models.IntegerField()
    work_id = models.IntegerField(null=True, blank=True)  # add null=True
    assigned_date = models.DateTimeField()
    updated_date = models.DateTimeField(null=True, blank=True)
    actual_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50)
    comments = models.TextField(null=True, blank=True)
    team_member_id = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Assignment {self.id} - {self.status}"
