from django.db import models


class ERPUser(models.Model):
    # Identity fields — mirrored from Keycloak JWT, synced on every authenticated request
    sub = models.CharField(max_length=255, unique=True, db_index=True)
    username = models.CharField(max_length=150)
    email = models.EmailField(blank=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    roles = models.JSONField(default=list)  # e.g. ["editor", "viewer"]
    realm = models.CharField(max_length=150)

    # Business-specific fields — collected via the "complete profile" step
    designation = models.CharField(max_length=100, blank=True, null=True)
    employee_id = models.CharField(max_length=50, blank=True, null=True)   # ← user input, NOT auto-generated
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    team_member_id = models.IntegerField(unique=True, null=True, blank=True)   # Auto-generated, unique identifier

    profile_completed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)

        if is_new and self.team_member_id is None:
            self.team_member_id = self.id
            super().save(update_fields=['team_member_id'])

    def __str__(self):
        return f"{self.username} ({self.sub})"