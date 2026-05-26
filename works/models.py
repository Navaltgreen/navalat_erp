# from django.db import models


# class Issue(models.Model):
#     project_id = models.IntegerField()
#     category = models.CharField(max_length=255)
#     subcategory = models.CharField(max_length=255)
#     tab = models.CharField(max_length=100)
#     status = models.CharField(max_length=50)
#     images = models.CharField(max_length=255, null=True, blank=True)
#     description = models.TextField()
#     comments = models.TextField(null=True, blank=True)
#     team_id = models.IntegerField(null=True, blank=True)

#     created_at = models.DateTimeField(auto_now_add=True)
#     created_by = models.IntegerField(null=True, blank=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     updated_by = models.IntegerField(null=True, blank=True)

#     def __str__(self):
#         return f"{self.category} - {self.subcategory}"
from django.db import models
class Works(models.Model):  # ✅ renamed from Issue
    project_id = models.IntegerField(null=True, blank=True)
    category = models.CharField(max_length=255)
    subcategory = models.CharField(max_length=255)
    tab = models.CharField(max_length=100,blank=True)
    status = models.CharField(max_length=50)
    images = models.JSONField(null=True, blank=True, default=list)
    description = models.TextField()
    comments = models.TextField(null=True, blank=True)
    # team_id = models.IntegerField(null=True, blank=True)
    team_id = models.JSONField(null=True, blank=True, default=list)  # List of team ids



    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.category} - {self.subcategory}"