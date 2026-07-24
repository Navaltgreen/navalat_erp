from django.db import models


class Team(models.Model):
    team_id = models.IntegerField()
    name = models.CharField(max_length=255) #Name of the Team (Eg: Backend)
    member = models.CharField(max_length=255, null=True, blank=True)  # name of the team member (Eg: )
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name

