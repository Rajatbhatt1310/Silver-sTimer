from django.urls import include, path


urlpatterns = [

    # Authentication
    path(
        "auth/",
        include("authentication.urls"),
    ),

    # Users
    path(
        "users/",
        include("users.urls"),
    ),

    # Focus
    path(
        "focus/",
        include("focus.urls"),
    ),

    # Planner
    path(
        "planner/",
        include("planner.urls"),
    ),

    # Analytics
    path(
        "analytics/",
        include("analytics.urls"),
    ),

    # Leaderboards
    path(
        "leaderboards/",
        include("leaderboards.urls"),
    ),

    # Gamification
    path(
        "gamification/",
        include("gamification.urls"),
    ),

    # Notifications
    path(
        "notifications/",
        include("notifications.urls"),
    ),

    # AI
    path(
        "ai/",
        include("ai.urls"),
    ),

    # Social
    path(
        "social/",
        include("social.urls"),
    ),

    # Dashboard
    path(
        "dashboard/",
        include("dashboard.urls"),
    ),
]