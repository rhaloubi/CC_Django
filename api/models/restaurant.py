from django.db import models
from django.conf import settings

class Restaurant(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='restaurants'
    )
    company_name = models.CharField(max_length=255)
    phone_number = models.BigIntegerField()

    def __str__(self):
        return self.company_name