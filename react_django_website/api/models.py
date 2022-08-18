from django.contrib.auth.hashers import make_password
from django.db import models


class Account(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.password = make_password(self.password)
        super().save(*args, **kwargs)
