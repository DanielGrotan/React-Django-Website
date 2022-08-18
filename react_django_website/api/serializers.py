from rest_framework import serializers

from .models import Account


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ("id", "username", "password", "created_at")


class CreateAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ("username", "password")
