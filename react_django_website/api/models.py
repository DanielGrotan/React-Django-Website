from django.contrib.auth.hashers import make_password
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Account(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.password = make_password(self.password)
        super().save(*args, **kwargs)


class ClassList(models.Model):
    account_id = models.IntegerField()
    names = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class ClassroomLayout(models.Model):
    account_id = models.IntegerField()
    rows = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(100)]
    )
    columns = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(100)]
    )
    table_positions = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
