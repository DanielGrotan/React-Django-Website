from django.contrib.auth.hashers import check_password
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Account
from .serializers import AccountSerializer, CreateAccountSerializer


class AccountView(generics.ListAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer


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
                    {"username": account_queryset[0].username},
                    status=status.HTTP_200_OK,
                )

        return Response({"Ok": "Not logged in yet"}, status=status.HTTP_200_OK)


class LogOutView(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        self.request.session.pop("user_id", None)

        return Response({"Ok": "Logged out"}, status=status.HTTP_200_OK)
