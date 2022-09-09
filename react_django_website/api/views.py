from django.contrib.auth.hashers import check_password
from django.core import serializers
from django.http import HttpResponse
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Account, ClassList, ClassroomLayout
from .serializers import (
    AccountSerializer,
    ClassListSerializer,
    ClassroomLayoutSerializer,
    CreateAccountSerializer,
    CreateClassListSerializer,
    CreateClassroomLayoutSerializer,
    UpdateClassListSerializer,
)


class AccountView(generics.ListAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer


class ClassListView(generics.ListAPIView):
    queryset = ClassList.objects.all()
    serializer_class = ClassListSerializer


class ClassroomLayoutView(generics.ListAPIView):
    queryset = ClassroomLayout.objects.all()
    serializer_class = ClassroomLayoutSerializer


class LogIntoAccountView(APIView):
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        username = request.data.get("username")
        password = request.data.get("password")

        account = Account.objects.filter(username=username)

        if account.exists():
            account = account[0]
            if check_password(password, account.password):
                self.request.session["user_id"] = account.id
                return Response({"Ok": "Logged In"}, status=status.HTTP_200_OK)

        return Response(
            {"Error": "Ugyldig brukernavn eller passord"},
            status=status.HTTP_401_UNAUTHORIZED,
        )


class CreateAccountView(APIView):
    serializer_class = CreateAccountSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            username = serializer.data.get("username")
            password = serializer.data.get("password")

            account = Account(username=username, password=password)
            account.save()

            self.request.session["user_id"] = account.id

            return Response(
                AccountSerializer(account).data, status=status.HTTP_201_CREATED
            )

        username_errors = serializer.errors.get("username")

        if username_errors is not None and any(
            map(lambda error: error.code == "unique", username_errors)
        ):
            return Response(
                {"Error": "Brukernavnet er allerede tatt"}, status=status.HTTP_200_OK
            )

        return Response(
            {"Error": "Ugyldig data..."}, status=status.HTTP_400_BAD_REQUEST
        )


class GetAccountStatusView(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        if (user_id := self.request.session.get("user_id")) is not None:
            account_queryset = Account.objects.filter(id=user_id)

            if account_queryset.exists():
                return Response(
                    {"Logged in": True},
                    status=status.HTTP_200_OK,
                )

        return Response({"Logged in": False}, status=status.HTTP_200_OK)


class LogOutView(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        self.request.session.pop("user_id", None)

        return Response({"Ok": "Logged out"}, status=status.HTTP_200_OK)


class CreateClassListView(APIView):
    serializer_class = CreateClassListSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        if (account_id := self.request.session.get("user_id")) is None:
            return Response(
                {"Unauthorized", "Not logged in"}, status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            name = serializer.data.get("name")
            names = serializer.data.get("names")

            class_list = ClassList(account_id=account_id, name=name, names=names)
            class_list.save()

            return Response(
                {"Created": "Class list created"}, status=status.HTTP_201_CREATED
            )

        return Response(
            {"Bad request": "Invalid data..."}, status=status.HTTP_400_BAD_REQUEST
        )

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        if (account_id := self.request.session.get("user_id")) is None:
            return Response(
                {"Unauthorized", "Not logged in"}, status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = UpdateClassListSerializer(data=request.data)

        if serializer.is_valid():
            id = request.data.get("id")
            names = request.data.get("names")

            class_list = ClassList.objects.filter(id=id, account_id=account_id)
            if class_list.exists():
                class_list = class_list[0]

                class_list.names = names
                class_list.save()

                return Response(
                    {"Success", "Class List has been updated"},
                    status=status.HTTP_200_OK,
                )

            return Response({"Test": "idk"}, status=status.HTTP_406_NOT_ACCEPTABLE)

        return Response(
            {"Bad Request": "Invalid data..."}, status=status.HTTP_400_BAD_REQUEST
        )


class CreateClassroomLayoutView(APIView):
    serializer_class = CreateClassroomLayoutSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        if (account_id := self.request.session.get("user_id")) is None:
            return Response(
                {"Unauthorized", "Not logged in"}, status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            name = serializer.data.get("name")
            rows = serializer.data.get("rows")
            columns = serializer.data.get("columns")
            table_positions = serializer.data.get("table_positions")

            classroom_layout = ClassroomLayout(
                account_id=account_id,
                name=name,
                rows=rows,
                columns=columns,
                table_positions=table_positions,
            )
            classroom_layout.save()

            return Response(
                {"Created": "Classroom layout created"}, status=status.HTTP_201_CREATED
            )

        return Response(
            {"Bad request": "Invalid data..."}, status=status.HTTP_400_BAD_REQUEST
        )


class GetClassListsView(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        if (account_id := self.request.session.get("user_id")) is None:
            return Response(
                {"Unauthorized", "Not logged in"}, status=status.HTTP_401_UNAUTHORIZED
            )

        queryset = ClassList.objects.filter(account_id=account_id)
        queryset_json = serializers.serialize(
            "json", queryset, fields=("name", "names")
        )
        return HttpResponse(queryset_json, content_type="application/json")


class GetClassroomLayoutsView(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        if (account_id := self.request.session.get("user_id")) is None:
            return Response(
                {"Unauthorized", "Not logged in"}, status=status.HTTP_401_UNAUTHORIZED
            )

        queryset = ClassroomLayout.objects.filter(account_id=account_id)
        queryset_json = serializers.serialize(
            "json", queryset, fields=("name", "rows", "columns", "table_positions")
        )
        return HttpResponse(queryset_json, content_type="application/json")
