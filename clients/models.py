from django.db import models


class Client(models.Model):
    name = models.CharField(max_length=255)
    phone_number = models.IntegerField(null=True, blank=True)
    email = models.CharField(max_length=255, unique=True, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.name

