from rest_framework import serializers

from .models import Account, ClassList, ClassroomLayout


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ("id", "username", "password", "created_at")


class ClassListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassList
        fields = ("id", "name", "names", "created_at")


class ClassroomLayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassroomLayout
        fields = ("id", "name", "rows", "columns", "table_positions", "created_at")


class CreateAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ("username", "password")


class CreateClassListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassList
        fields = ("name", "names")
    

class UpdateClassListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassList
        fields = ("id", "names")


class CreateClassroomLayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassroomLayout
        fields = ("name", "rows", "columns", "table_positions")
