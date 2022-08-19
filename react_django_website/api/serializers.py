from rest_framework import serializers

from .models import Account


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ("id", "username", "password", "created_at")


class AccountAuthenticationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ("username", "password")
