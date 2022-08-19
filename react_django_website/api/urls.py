from django.urls import path

from .views import AccountView, CreateAccountView, LogIntoAccountView

urlpatterns = [
    path("accounts", AccountView.as_view()),
    path("create-account", CreateAccountView.as_view()),
    path("login-to-account", LogIntoAccountView.as_view()),
]
