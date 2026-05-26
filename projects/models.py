from django.db import models


class Project(models.Model):
    name = models.CharField(max_length=255)
    # Link to a Client (nullable). Use string reference to avoid import cycles.
    client = models.ForeignKey('clients.Client', null=True, blank=True, on_delete=models.SET_NULL, related_name='projects')
    team_id = models.JSONField(null=True, blank=True, default=list)  # List of team ids
    category = models.JSONField(null=True, blank=True, default=list)  # List of categories
    subcategory = models.JSONField(null=True, blank=True, default=list)  # List of subcategories
    tab = models.JSONField(null=True, blank=True, default=list)  # List of tabs
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name