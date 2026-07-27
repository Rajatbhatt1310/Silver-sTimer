from datetime import timedelta

from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from django.http import JsonResponse
from django.utils import timezone

from focus.models import FocusSession
from gamification.models import UserAchievement
from planner.models import Task
from users.models import UserStats


@login_required
def dashboard(request):
    user = request.user
    today = timezone.localdate()

    # --------------------------------------------------
    # User stats
    # --------------------------------------------------

    stats, _ = UserStats.objects.get_or_create(
        user=user
    )

    # --------------------------------------------------
    # Today's focus
    # --------------------------------------------------

    today_focus_seconds = (
        FocusSession.objects.filter(
            user=user,
            started_at__date=today,
            completed=True,
        ).aggregate(
            total=Sum("actual_duration")
        )["total"]
        or 0
    )

    today_focus_minutes = (
        today_focus_seconds // 60
    )

    # --------------------------------------------------
    # Today's goal
    # Temporary default: 4 hours / 240 minutes.
    # Later this can become a user setting.
    # --------------------------------------------------

    daily_goal_minutes = 240

    goal_percent = min(
        round(
            (
                today_focus_minutes
                / daily_goal_minutes
            )
            * 100
        ),
        100,
    )

    # --------------------------------------------------
    # Weekly focus
    # Monday -> Sunday
    # --------------------------------------------------

    monday = today - timedelta(
        days=today.weekday()
    )

    weekly_focus = []

    for offset in range(7):
        current_date = (
            monday
            + timedelta(days=offset)
        )

        seconds = (
            FocusSession.objects.filter(
                user=user,
                started_at__date=current_date,
                completed=True,
            ).aggregate(
                total=Sum("actual_duration")
            )["total"]
            or 0
        )

        minutes = seconds // 60

        weekly_focus.append(
            {
                "label":
                    current_date.strftime("%a"),
                "value":
                    minutes,
            }
        )

    weekly_total_minutes = sum(
        day["value"]
        for day in weekly_focus
    )

    # --------------------------------------------------
    # Today's tasks
    # --------------------------------------------------

    today_tasks_queryset = (
        Task.objects.filter(
            user=user,
            date=today,
        )
        .order_by(
            "completed",
            "start_time",
            "-created_at",
        )
    )

    task_preview = []

    for task in today_tasks_queryset[:5]:
        task_preview.append(
            {
                "id":
                    task.id,

                "title":
                    task.title,

                "subject":
                    task.category,

                "duration":
                    (
                        f"{task.duration} min"
                        if task.duration
                        else None
                    ),

                "done":
                    task.completed,

                "priority":
                    task.priority,

                "start_time":
                    (
                        task.start_time.strftime(
                            "%H:%M"
                        )
                        if task.start_time
                        else None
                    ),
            }
        )

    completed_tasks = (
        today_tasks_queryset
        .filter(completed=True)
        .count()
    )

    pending_tasks = (
        today_tasks_queryset
        .filter(completed=False)
        .count()
    )

    # --------------------------------------------------
    # Recent achievements
    # --------------------------------------------------

    recent_achievements = (
        UserAchievement.objects
        .filter(user=user)
        .select_related("achievement")
        .order_by("-unlocked_at")[:3]
    )

    achievements = []

    for user_achievement in recent_achievements:
        achievement = (
            user_achievement.achievement
        )

        achievements.append(
            {
                "id":
                    achievement.id,

                "code":
                    achievement.code,

                "title":
                    achievement.title,

                "subtitle":
                    achievement.description,

                "category":
                    achievement.category,

                "icon":
                    achievement.icon,

                "unlocked_at":
                    user_achievement
                    .unlocked_at
                    .isoformat(),
            }
        )

    # --------------------------------------------------
    # Response
    # --------------------------------------------------

    return JsonResponse(
        {
            "user": {
                "name":
                    user.profile.full_name,
            },

            "stats": {
                "xp":
                    stats.xp,

                "level":
                    stats.level,

                "streak":
                    stats.current_streak,

                "focus_score":
                    float(
                        stats.focus_score
                    ),

                "today_focus":
                    today_focus_minutes,

                "total_study_minutes":
                    stats.total_study_minutes,

                "completed_sessions":
                    stats.completed_sessions,
            },

            "goal": {
                "target_minutes":
                    daily_goal_minutes,

                "focused_minutes":
                    today_focus_minutes,

                "percent":
                    goal_percent,
            },

            "weekly": {
                "total_minutes":
                    weekly_total_minutes,

                "data":
                    weekly_focus,
            },

            "tasks": {
                "today":
                    today_tasks_queryset.count(),

                "completed":
                    completed_tasks,

                "pending":
                    pending_tasks,

                "items":
                    task_preview,
            },

            "achievements":
                achievements,
        }
    )