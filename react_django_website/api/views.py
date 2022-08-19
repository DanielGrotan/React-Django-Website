from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Account
from .serializers import AccountSerializer, CreateAccountSerializer


class AccountView(generics.ListAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer


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
