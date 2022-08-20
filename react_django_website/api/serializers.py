from rest_framework import serializers

from .models import Account, ClassList, ClassroomLayout


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ("id", "username", "password", "created_at")


class ClassListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassList
        fields = ("id", "names", "created_at")


class ClassroomLayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassroomLayout
        fields = ("id", "rows", "columns", "table_positions", "created_at")


class CreateAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ("username", "password")


class CreateClassListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassList
        fields = ("names",)


class CreateClassroomLayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassroomLayout
        fields = ("rows", "columns", "table_positions")
