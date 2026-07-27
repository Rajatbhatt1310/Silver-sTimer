from datetime import timedelta

from django.db import transaction
from django.utils import timezone
from leaderboards.models import XPTransaction
from users.models import UserStats
from .models import Achievement, UserAchievement


# ==================================================
# XP + LEVEL CONFIGURATION
# ==================================================

# One real focused minute = one XP.
XP_PER_MINUTE = 1


def xp_needed_for_next_level(level):
    """
    XP required to progress from the given
    level to the next level.

    Examples:
    Level 1 -> 2 = 100 XP
    Level 2 -> 3 = 150 XP
    Level 3 -> 4 = 200 XP
    Level 4 -> 5 = 250 XP
    """

    return 100 + ((level - 1) * 50)


def total_xp_for_level(level):
    """
    Total lifetime XP required to reach
    the beginning of a level.

    Examples:
    Level 1 = 0 XP
    Level 2 = 100 XP
    Level 3 = 250 XP
    Level 4 = 450 XP
    Level 5 = 700 XP
    """

    if level <= 1:
        return 0

    levels_completed = level - 1

    return (
        levels_completed * 100
        + (
            levels_completed
            * (levels_completed - 1)
            // 2
        )
        * 50
    )


def calculate_level(total_xp):
    """
    Calculate the user's level from their
    total lifetime XP.
    """

    level = 1

    while total_xp >= total_xp_for_level(
        level + 1
    ):
        level += 1

    return level


def get_level_progress(total_xp):
    """
    Return information useful for showing
    the level progress bar on the frontend.
    """

    level = calculate_level(total_xp)

    current_level_start = (
        total_xp_for_level(level)
    )

    next_level_start = (
        total_xp_for_level(level + 1)
    )

    xp_into_level = (
        total_xp
        - current_level_start
    )

    xp_required = (
        next_level_start
        - current_level_start
    )

    xp_remaining = max(
        0,
        next_level_start - total_xp,
    )

    progress_percent = (
        (xp_into_level / xp_required) * 100
        if xp_required > 0
        else 100
    )

    return {
        "level": level,

        "current_xp":
            total_xp,

        "xp_into_level":
            xp_into_level,

        "xp_required":
            xp_required,

        "xp_remaining":
            xp_remaining,

        "next_level":
            level + 1,

        "progress_percent":
            round(progress_percent, 1),
    }


# ==================================================
# ACHIEVEMENT DEFINITIONS
# ==================================================

ACHIEVEMENTS = [

    {
        "code": "first_focus",

        "title": "First Focus",

        "description":
            "Complete your first focus session.",

        "category": "focus",

        "icon": "Target",

        "xp_reward": 0,

        "condition": lambda stats: (
            stats.completed_sessions >= 1
        ),
    },

    {
        "code": "focus_five",

        "title": "Focus Five",

        "description":
            "Complete 5 focus sessions.",

        "category": "focus",

        "icon": "Timer",

        "xp_reward": 0,

        "condition": lambda stats: (
            stats.completed_sessions >= 5
        ),
    },

    {
        "code": "deep_worker",

        "title": "Deep Worker",

        "description":
            "Complete 25 focus sessions.",

        "category": "focus",

        "icon": "Brain",

        "xp_reward": 0,

        "condition": lambda stats: (
            stats.completed_sessions >= 25
        ),
    },

    {
        "code": "xp_10",

        "title": "Getting Started",

        "description":
            "Earn 10 XP.",

        "category": "xp",

        "icon": "Zap",

        "xp_reward": 0,

        "condition": lambda stats: (
            stats.xp >= 10
        ),
    },

    {
        "code": "xp_100",

        "title": "Century Club",

        "description":
            "Earn 100 XP.",

        "category": "xp",

        "icon": "Star",

        "xp_reward": 0,

        "condition": lambda stats: (
            stats.xp >= 100
        ),
    },

    {
        "code": "streak_7",

        "title": "On Fire",

        "description":
            "Reach a 7-day focus streak.",

        "category": "streak",

        "icon": "Flame",

        "xp_reward": 0,

        "condition": lambda stats: (
            stats.current_streak >= 7
        ),
    },

    {
        "code": "streak_30",

        "title": "Unstoppable",

        "description":
            "Reach a 30-day focus streak.",

        "category": "streak",

        "icon": "Trophy",

        "xp_reward": 0,

        "condition": lambda stats: (
            stats.current_streak >= 30
        ),
    },
]


# ==================================================
# ACHIEVEMENT CHECKER
# ==================================================

def check_achievements(user, stats):
    """
    Check all achievement rules and unlock
    achievements the user has newly earned.
    """

    unlocked = []

    for rule in ACHIEVEMENTS:

        if not rule["condition"](stats):
            continue

        achievement, _ = (
            Achievement.objects.get_or_create(
                code=rule["code"],
                defaults={
                    "title":
                        rule["title"],

                    "description":
                        rule["description"],

                    "category":
                        rule["category"],

                    "icon":
                        rule["icon"],

                    "xp_reward":
                        rule["xp_reward"],
                },
            )
        )

        _, created = (
            UserAchievement.objects.get_or_create(
                user=user,
                achievement=achievement,
            )
        )

        if created:

            unlocked.append(
                {
                    "code":
                        achievement.code,

                    "title":
                        achievement.title,

                    "description":
                        achievement.description,

                    "category":
                        achievement.category,

                    "icon":
                        achievement.icon,
                }
            )

    return unlocked


# ==================================================
# FOCUS SESSION REWARDS
# ==================================================

@transaction.atomic
def reward_completed_session(
    user,
    actual_duration,
):
    """
    Reward a user after completing a focus
    session.

    actual_duration is the REAL focused
    duration in seconds.

    XP rules:

    - 1 focused minute = 1 XP
    - Partial minutes do not earn XP
    - Paused time is already excluded by
      focus-session tracking
    """

    stats, _ = (
        UserStats.objects
        .select_for_update()
        .get_or_create(
            user=user
        )
    )


    # --------------------------------------------------
    # Convert focused seconds -> completed minutes
    # --------------------------------------------------

    focus_minutes = (
        max(0, actual_duration) // 60
    )


    # --------------------------------------------------
    # Calculate XP
    # --------------------------------------------------

    xp_earned = (
        focus_minutes
        * XP_PER_MINUTE
    )


    today = timezone.localdate()



    stats.xp += xp_earned

    stats.level = calculate_level(
        stats.xp
    )


    if xp_earned > 0:
        XPTransaction.objects.create(
        user=user,
        amount=xp_earned,
        source="focus_session",
        )


    stats.total_study_minutes += (
        focus_minutes
    )

    stats.completed_sessions += 1


    # --------------------------------------------------
    # STREAK
    # --------------------------------------------------

    if stats.last_study_date is None:

        stats.current_streak = 1


    elif stats.last_study_date == today:

        # User already completed a session
        # today. Don't increase streak again.
        pass


    elif (
        stats.last_study_date
        == today - timedelta(days=1)
    ):

        stats.current_streak += 1


    else:

        # User missed at least one day.
        stats.current_streak = 1


    stats.longest_streak = max(
        stats.longest_streak,
        stats.current_streak,
    )

    stats.last_study_date = today


    # --------------------------------------------------
    # SAVE STATS
    # --------------------------------------------------

    stats.save()


    # --------------------------------------------------
    # ACHIEVEMENTS
    # --------------------------------------------------

    unlocked_achievements = (
        check_achievements(
            user,
            stats,
        )
    )


    # --------------------------------------------------
    # LEVEL PROGRESS
    # --------------------------------------------------

    level_progress = (
        get_level_progress(
            stats.xp
        )
    )


    # --------------------------------------------------
    # RESPONSE
    # --------------------------------------------------

    return {
        "xp_earned":
            xp_earned,

        "xp":
            stats.xp,

        "level":
            stats.level,

        "level_progress":
            level_progress,

        "current_streak":
            stats.current_streak,

        "longest_streak":
            stats.longest_streak,

        "total_study_minutes":
            stats.total_study_minutes,

        "completed_sessions":
            stats.completed_sessions,

        "focus_score":
            float(stats.focus_score),

        "achievements":
            unlocked_achievements,
    }