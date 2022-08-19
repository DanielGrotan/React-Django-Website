from django.urls import path

from .views import index

urlpatterns = [
    path("", index),
    path("logg-inn", index),
    path("registrer", index),
]
