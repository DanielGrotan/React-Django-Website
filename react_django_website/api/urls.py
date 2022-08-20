from django.urls import path

from .views import (
    AccountView,
    ClassListView,
    ClassroomLayoutView,
    CreateAccountView,
    CreateClassListView,
    CreateClassroomLayoutView,
    GetAccountStatusView,
    GetClassListsView,
    GetClassroomLayoutsView,
    LogIntoAccountView,
    LogOutView,
)

urlpatterns = [
    path("accounts", AccountView.as_view()),
    path("class-lists", ClassListView.as_view()),
    path("classroom-layouts", ClassroomLayoutView.as_view()),
    path("create-account", CreateAccountView.as_view()),
    path("login", LogIntoAccountView.as_view()),
    path("account-status", GetAccountStatusView.as_view()),
    path("logout", LogOutView.as_view()),
    path("create-class-list", CreateClassListView.as_view()),
    path("create-classroom-layout", CreateClassroomLayoutView.as_view()),
    path("get-class-lists", GetClassListsView.as_view()),
    path("get-classroom-layouts", GetClassroomLayoutsView.as_view()),
]
