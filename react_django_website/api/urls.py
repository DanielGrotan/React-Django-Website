from django.urls import path

from .views import (
    AccountView,
    CreateAccountView,
    GetAccountStatusView,
    LogIntoAccountView,
    LogOutView,
)

urlpatterns = [
    path("accounts", AccountView.as_view()),
    path("create-account", CreateAccountView.as_view()),
    path("login", LogIntoAccountView.as_view()),
    path("account-status", GetAccountStatusView.as_view()),
    path("logout", LogOutView.as_view()),
]
