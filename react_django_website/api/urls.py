from django.urls import path

from .views import AccountView, CreateAccountView

urlpatterns = [
    path("accounts", AccountView.as_view()),
    path("create-account", CreateAccountView.as_view()),
]
