from datetime import timedelta
from .services import (
    get_tracker_analysis,
    get_tracker_status,
)
from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from django.http import JsonResponse
from django.utils import timezone

from focus.models import FocusSession
from planner.models import Task
from users.models import UserStats

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

from .services import (
    get_tracker_status,
    get_tracker_analysis,
    get_stopwatch_status,
    get_stopwatch_analysis,
)


@login_required
def analytics(request):
    user = request.user
    today = timezone.localdate()

    # --------------------------------------------------
    # User stats
    # --------------------------------------------------

    stats, _ = UserStats.objects.get_or_create(
        user=user
    )

    # --------------------------------------------------
    # Main statistics
    # --------------------------------------------------

    analytics_stats = {
        "totalFocusMinutes":
            stats.total_study_minutes,

        "sessionsCompleted":
            stats.completed_sessions,

        "focusScore":
            round(
                float(stats.focus_score)
            ),

        "currentStreak":
            stats.current_streak,
    }

    # --------------------------------------------------
    # Focus activity - last 7 days
    # --------------------------------------------------

    focus_data = []

    for offset in range(6, -1, -1):
        current_date = (
            today - timedelta(days=offset)
        )

        total_seconds = (
            FocusSession.objects.filter(
                user=user,
                completed=True,
                started_at__date=current_date,
            )
            .aggregate(
                total=Sum(
                    "actual_duration"
                )
            )["total"]
            or 0
        )

        focus_data.append(
            {
                "label":
                    current_date.strftime(
                        "%a"
                    ),

                "date":
                    current_date.isoformat(),

                "minutes":
                    total_seconds // 60,
            }
        )

    # --------------------------------------------------
    # Productivity - last 7 days
    #
    # Productivity is currently calculated as:
    # completed sessions / ended sessions
    # --------------------------------------------------

    productivity_data = []

    for offset in range(6, -1, -1):
        current_date = (
            today - timedelta(days=offset)
        )

        day_sessions = (
            FocusSession.objects.filter(
            user=user,
            started_at__date=current_date,
            ended_at__isnull=False,
             )
        )

        total_sessions = (
            day_sessions.count()
        )

        completed_sessions = (
            day_sessions.filter(
                completed=True
            ).count()
        )

        if total_sessions > 0:
            score = round(
                (
                    completed_sessions
                    / total_sessions
                )
                * 100
            )
        else:
            score = 0

        productivity_data.append(
            {
                "label":
                    current_date.strftime(
                        "%a"
                    ),

                "date":
                    current_date.isoformat(),

                "score":
                    score,
            }
        )

    # --------------------------------------------------
    # Category breakdown
    #
    # Currently based on completed planner tasks
    # and their planned duration.
    # --------------------------------------------------

    category_totals = {}

    completed_tasks = (
        Task.objects.filter(
            user=user,
            completed=True,
        )
    )

    for task in completed_tasks:
        category = (
            task.category
            or "Uncategorized"
        )

        minutes = (
            task.duration
            or 0
        )

        category_totals[category] = (
            category_totals.get(
                category,
                0,
            )
            + minutes
        )

    category_data = [
        {
            "category":
                category,

            "minutes":
                minutes,
        }
        for category, minutes
        in category_totals.items()
        if minutes > 0
    ]

    category_data.sort(
        key=lambda item:
            item["minutes"],
        reverse=True,
    )

    # --------------------------------------------------
    # Response
    # --------------------------------------------------

    return JsonResponse(
        {
            "stats":
                analytics_stats,

            "focusData":
                focus_data,

            "productivityData":
                productivity_data,

            "categoryData":
                category_data,
        }
    )
@login_required
def tracker_status(request):
    if request.method != "GET":
        return JsonResponse(
            {"error": "Method not allowed."},
            status=405,
        )

    data = get_tracker_status(
        request.user
    )

    return JsonResponse(data)

@login_required
def tracker_analysis(request):
    if request.method != "GET":
        return JsonResponse(
            {"error": "Method not allowed."},
            status=405,
        )

    data = get_tracker_analysis(
        request.user
    )

    return JsonResponse(data)

@login_required
def tracker_status(request):
    if request.method != "GET":
        return JsonResponse(
            {"error": "Method not allowed."},
            status=405,
        )

    return JsonResponse(
        get_tracker_status(request.user)
    )


@login_required
def tracker_analysis(request):
    if request.method != "GET":
        return JsonResponse(
            {"error": "Method not allowed."},
            status=405,
        )

    return JsonResponse(
        get_tracker_analysis(request.user)
    )


@login_required
def stopwatch_status(request):
    if request.method != "GET":
        return JsonResponse(
            {"error": "Method not allowed."},
            status=405,
        )

    return JsonResponse(
        get_stopwatch_status(request.user)
    )


@login_required
def stopwatch_analysis(request):
    if request.method != "GET":
        return JsonResponse(
            {"error": "Method not allowed."},
            status=405,
        )

    return JsonResponse(
        get_stopwatch_analysis(request.user)
    )