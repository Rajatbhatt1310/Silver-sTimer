from datetime import datetime, time, timedelta

from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from django.http import JsonResponse
from django.utils import timezone

from users.models import UserStats

from .models import XPTransaction


# ==================================================
# HELPERS
# ==================================================

def get_period_start(period):
    """
    Return the starting datetime for the
    requested leaderboard period.

    weekly:
        Monday 00:00

    monthly:
        First day of current month 00:00

    all_time:
        None
    """

    today = timezone.localdate()

    if period == "weekly":
        monday = today - timedelta(
            days=today.weekday()
        )

        return timezone.make_aware(
            datetime.combine(
                monday,
                time.min,
            ),
            timezone.get_current_timezone(),
        )

    if period == "monthly":
        first_day = today.replace(
            day=1
        )

        return timezone.make_aware(
            datetime.combine(
                first_day,
                time.min,
            ),
            timezone.get_current_timezone(),
        )

    return None


def get_display_name(user):
    """
    Return profile full name when available.
    Otherwise return username.
    """

    profile = getattr(
        user,
        "profile",
        None,
    )

    if (
        profile
        and profile.full_name
    ):
        return profile.full_name

    return user.username


def serialize_ranked_user(
    stats,
    rank,
    leaderboard_xp,
    current_user_id,
):
    """
    Convert UserStats into leaderboard JSON.
    """

    return {
        "rank": rank,

        "user_id":
            stats.user_id,

        "name":
            get_display_name(
                stats.user
            ),

        "username":
            stats.user.username,

        # XP earned for selected period.
        "xp":
            leaderboard_xp,

        # Lifetime XP.
        "total_xp":
            stats.xp,

        "level":
            stats.level,

        "study_minutes":
            stats.total_study_minutes,

        "streak":
            stats.current_streak,

        "is_current_user":
            stats.user_id
            == current_user_id,
    }


# ==================================================
# LEADERBOARD
# ==================================================

@login_required
def leaderboard(request):
    user = request.user

    period = request.GET.get(
        "period",
        "weekly",
    )

    allowed_periods = {
        "weekly",
        "monthly",
        "all_time",
    }

    if period not in allowed_periods:
        return JsonResponse(
            {
                "error":
                    "Invalid leaderboard period.",

                "allowed_periods": [
                    "weekly",
                    "monthly",
                    "all_time",
                ],
            },
            status=400,
        )


    # ==================================================
    # ALL-TIME
    # ==================================================

    if period == "all_time":

        ranked_stats = list(
            UserStats.objects
            .select_related(
                "user",
                "user__profile",
            )
            .order_by(
                "-xp",
                "-total_study_minutes",
                "user__username",
            )
        )

        ranked_users = []

        for rank, stats in enumerate(
            ranked_stats,
            start=1,
        ):
            ranked_users.append(
                serialize_ranked_user(
                    stats=stats,
                    rank=rank,
                    leaderboard_xp=stats.xp,
                    current_user_id=user.id,
                )
            )


    # ==================================================
    # WEEKLY / MONTHLY
    # ==================================================

    else:

        period_start = get_period_start(
            period
        )

        # ----------------------------------------------
        # Calculate XP earned in this period
        # ----------------------------------------------

        period_xp_rows = list(
            XPTransaction.objects
            .filter(
                created_at__gte=period_start
            )
            .values(
                "user_id"
            )
            .annotate(
                period_xp=Sum("amount")
            )
        )


        xp_by_user = {
            row["user_id"]:
                row["period_xp"] or 0

            for row in period_xp_rows
        }


        # ----------------------------------------------
        # Load UserStats for ranked users
        # ----------------------------------------------

        stats_by_user = {
            stats.user_id: stats

            for stats in (
                UserStats.objects
                .filter(
                    user_id__in=
                        list(
                            xp_by_user.keys()
                        )
                )
                .select_related(
                    "user",
                    "user__profile",
                )
            )
        }


        ranking_data = []

        for (
            user_id,
            period_xp,
        ) in xp_by_user.items():

            stats = stats_by_user.get(
                user_id
            )

            if stats is None:
                continue

            ranking_data.append(
                {
                    "stats": stats,
                    "period_xp": period_xp,
                }
            )


        # ----------------------------------------------
        # Ranking:
        #
        # 1. Period XP
        # 2. Lifetime focus minutes
        # 3. Username
        # ----------------------------------------------

        ranking_data.sort(
            key=lambda item: (
                -item["period_xp"],
                -item[
                    "stats"
                ].total_study_minutes,
                item[
                    "stats"
                ].user.username.lower(),
            )
        )


        ranked_users = []

        for rank, item in enumerate(
            ranking_data,
            start=1,
        ):
            stats = item["stats"]

            ranked_users.append(
                serialize_ranked_user(
                    stats=stats,
                    rank=rank,
                    leaderboard_xp=
                        item["period_xp"],
                    current_user_id=user.id,
                )
            )


    # ==================================================
    # TOP 10
    # ==================================================

    top_users = ranked_users[:10]


    # ==================================================
    # CURRENT USER
    # ==================================================

    current_user_stats = (
        UserStats.objects
        .select_related(
            "user",
            "user__profile",
        )
        .filter(
            user=user
        )
        .first()
    )


    current_user_entry = next(
        (
            entry
            for entry in ranked_users
            if entry["user_id"] == user.id
        ),
        None,
    )


    # --------------------------------------------------
    # User exists but hasn't earned XP during
    # weekly/monthly period.
    # --------------------------------------------------

    if (
        current_user_entry is None
        and current_user_stats
    ):

        current_user_entry = {
            "rank":
                None,

            "user_id":
                user.id,

            "name":
                get_display_name(
                    user
                ),

            "username":
                user.username,

            "xp":
                (
                    current_user_stats.xp
                    if period == "all_time"
                    else 0
                ),

            "total_xp":
                current_user_stats.xp,

            "level":
                current_user_stats.level,

            "study_minutes":
                current_user_stats
                .total_study_minutes,

            "streak":
                current_user_stats
                .current_streak,

            "is_current_user":
                True,
        }


    # --------------------------------------------------
    # Safety fallback if UserStats does not exist.
    # --------------------------------------------------

    if current_user_entry is None:

        current_user_entry = {
            "rank":
                None,

            "user_id":
                user.id,

            "name":
                get_display_name(
                    user
                ),

            "username":
                user.username,

            "xp":
                0,

            "total_xp":
                0,

            "level":
                1,

            "study_minutes":
                0,

            "streak":
                0,

            "is_current_user":
                True,
        }


    # ==================================================
    # RESPONSE
    # ==================================================

    period_labels = {
        "weekly": "This Week",
        "monthly": "This Month",
        "all_time": "All Time",
    }


    return JsonResponse(
        {
            "period":
                period,

            "period_label":
                period_labels[period],

            "ranking_metric":
                "xp",

            "total_ranked_users":
                len(ranked_users),

            "top_users":
                top_users,

            "current_user":
                current_user_entry,
        }
    )
