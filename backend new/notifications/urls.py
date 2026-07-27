from django.urls import path

from .views import (
    mark_all_read,
    notification_detail,
    notification_list,
)


urlpatterns = [
    path(
        "",
        notification_list,
        name="notification-list",
    ),

    path(
        "read-all/",
        mark_all_read,
        name="notification-read-all",
    ),

    path(
        "<int:notification_id>/",
        notification_detail,
        name="notification-detail",
    ),
]