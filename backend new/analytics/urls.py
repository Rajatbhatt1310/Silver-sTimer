from django.urls import path

from .views import (
    analytics,
    stopwatch_analysis,
    stopwatch_status,
    tracker_analysis,
    tracker_status,
)


urlpatterns = [
    path(
        "",
        analytics,
        name="analytics",
    ),

    path(
        "tracker/",
        tracker_status,
        name="tracker-status",
    ),

    path(
        "tracker/analysis/",
        tracker_analysis,
        name="tracker-analysis",
    ),

    path(
        "stopwatch/",
        stopwatch_status,
        name="stopwatch-status",
    ),

    path(
        "stopwatch/analysis/",
        stopwatch_analysis,
        name="stopwatch-analysis",
    ),
]