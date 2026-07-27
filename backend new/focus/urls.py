from django.urls import path

from .views import (
    create_stopwatch_lap,
    session_detail,
    session_list_create,
)


urlpatterns = [
    path(
        "sessions/",
        session_list_create,
        name="session-list-create",
    ),

    path(
        "sessions/<int:session_id>/",
        session_detail,
        name="session-detail",
    ),

    path(
        "sessions/<int:session_id>/laps/",
        create_stopwatch_lap,
        name="stopwatch-lap-create",
    ),
]