
from django.contrib import admin
from .models import UserProfile, UserStats


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "full_name",
        "theme",
        "created_at",
    )

    search_fields = (
        "user__username",
        "full_name",
        "user__email",
    )

    list_filter = (
        "theme",
        "created_at",
    )


@admin.register(UserStats)
class UserStatsAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "level",
        "xp",
        "current_streak",
        "total_study_minutes",
        "completed_sessions",
        "completed_tasks",
    )

    search_fields = (
        "user__username",
    )