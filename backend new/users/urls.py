from django.urls import path

from .views import (
    notification_preferences,
)


urlpatterns = [
    path(
        "notification-preferences/",
        notification_preferences,
        name="notification-preferences",
    ),
]