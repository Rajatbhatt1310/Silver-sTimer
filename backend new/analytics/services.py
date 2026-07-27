from collections import defaultdict

from django.utils import timezone

from focus.models import FocusSession


# --------------------------------------------------
# Silver's Tracker thresholds
# --------------------------------------------------

TRACKER_REQUIRED_HOURS = 30

TRACKER_REQUIRED_SECONDS = (
    TRACKER_REQUIRED_HOURS
    * 60
    * 60
)

TRACKER_REQUIRED_SESSIONS = 20

TRACKER_REQUIRED_ACTIVE_DAYS = 7

# Ignore extremely short/test sessions.
MIN_VALID_SESSION_SECONDS = 5 * 60


# --------------------------------------------------
# Stopwatch Tracker thresholds
# --------------------------------------------------

STOPWATCH_REQUIRED_SESSIONS = 10

# Ignore accidental Start -> Stop sessions.
STOPWATCH_MIN_SESSION_SECONDS = 10


# ==================================================
# TRACKER STATUS
# ==================================================

def get_tracker_status(user):
    """
    Calculate Silver's Tracker learning progress.

    A valid tracker session:
    - belongs to the user
    - has ended
    - contains at least 5 minutes of actual focus

    The user does NOT need to complete the full
    planned timer for the focused time to count.
    """

    valid_sessions = (
        FocusSession.objects
        .filter(
            user=user,
            ended_at__isnull=False,
            actual_duration__gte=
                MIN_VALID_SESSION_SECONDS,
        )
        .order_by("started_at")
    )


    # --------------------------------------------------
    # Total tracked productive time
    # --------------------------------------------------

    tracked_seconds = sum(
        session.actual_duration
        for session in valid_sessions
    )

    tracked_hours = (
        tracked_seconds / 3600
    )


    # --------------------------------------------------
    # Valid session count
    # --------------------------------------------------

    valid_session_count = (
        valid_sessions.count()
    )


    # --------------------------------------------------
    # Active days
    # --------------------------------------------------

    active_dates = {
        timezone.localtime(
            session.started_at
        ).date()
        for session in valid_sessions
    }

    active_days = len(
        active_dates
    )


    # --------------------------------------------------
    # Individual requirement progress
    # --------------------------------------------------

    time_progress = min(
        tracked_seconds
        / TRACKER_REQUIRED_SECONDS,
        1,
    )

    session_progress = min(
        valid_session_count
        / TRACKER_REQUIRED_SESSIONS,
        1,
    )

    day_progress = min(
        active_days
        / TRACKER_REQUIRED_ACTIVE_DAYS,
        1,
    )


    # --------------------------------------------------
    # Overall learning progress
    #
    # The slowest requirement controls the progress
    # because all three conditions are required.
    # --------------------------------------------------

    overall_progress = min(
        time_progress,
        session_progress,
        day_progress,
    )

    progress_percent = round(
        overall_progress * 100
    )


    # --------------------------------------------------
    # Remaining requirements
    # --------------------------------------------------

    remaining_seconds = max(
        TRACKER_REQUIRED_SECONDS
        - tracked_seconds,
        0,
    )

    hours_remaining = (
        remaining_seconds / 3600
    )

    sessions_remaining = max(
        TRACKER_REQUIRED_SESSIONS
        - valid_session_count,
        0,
    )

    active_days_remaining = max(
        TRACKER_REQUIRED_ACTIVE_DAYS
        - active_days,
        0,
    )


    # --------------------------------------------------
    # Unlock condition
    # --------------------------------------------------

    tracker_unlocked = (
        tracked_seconds
        >= TRACKER_REQUIRED_SECONDS

        and valid_session_count
        >= TRACKER_REQUIRED_SESSIONS

        and active_days
        >= TRACKER_REQUIRED_ACTIVE_DAYS
    )


    # --------------------------------------------------
    # Tracker state
    # --------------------------------------------------

    if tracker_unlocked:
        status = "ready"

    elif tracked_seconds == 0:
        status = "not_started"

    else:
        status = "learning"


    return {
        "status":
            status,

        "unlocked":
            tracker_unlocked,

        "tracked": {
            "seconds":
                tracked_seconds,

            "minutes":
                tracked_seconds // 60,

            "hours":
                round(
                    tracked_hours,
                    2,
                ),

            "sessions":
                valid_session_count,

            "active_days":
                active_days,
        },

        "requirements": {
            "hours":
                TRACKER_REQUIRED_HOURS,

            "sessions":
                TRACKER_REQUIRED_SESSIONS,

            "active_days":
                TRACKER_REQUIRED_ACTIVE_DAYS,

            "minimum_session_minutes":
                MIN_VALID_SESSION_SECONDS
                // 60,
        },

        "remaining": {
            "hours":
                round(
                    hours_remaining,
                    2,
                ),

            "sessions":
                sessions_remaining,

            "active_days":
                active_days_remaining,
        },

        "progress_percent":
            progress_percent,
    }


# ==================================================
# TRACKER ANALYSIS
# ==================================================

def get_tracker_analysis(user):
    """
    Analyze the user's valid focus history.

    Behavioral insights are only exposed after
    Silver's Tracker has collected enough data.
    """

    tracker = get_tracker_status(
        user
    )


    # --------------------------------------------------
    # Tracker still learning
    # --------------------------------------------------

    if not tracker["unlocked"]:
        return {
            "available":
                False,

            "status":
                tracker["status"],

            "message":
                "Silver's Tracker is still "
                "learning your patterns.",

            "insights":
                None,
        }


    # --------------------------------------------------
    # Valid behavioral sessions
    # --------------------------------------------------

    sessions = (
        FocusSession.objects
        .filter(
            user=user,

            ended_at__isnull=False,

            actual_duration__gte=
                MIN_VALID_SESSION_SECONDS,
        )
        .select_related("task")
        .order_by("started_at")
    )


    # --------------------------------------------------
    # Analysis containers
    # --------------------------------------------------

    hourly_focus = defaultdict(
        int
    )

    weekday_focus = defaultdict(
        int
    )

    category_hour_focus = defaultdict(
        lambda: defaultdict(int)
    )

    session_lengths = []


    # --------------------------------------------------
    # Analyze every valid session
    # --------------------------------------------------

    for session in sessions:

        local_start = (
            timezone.localtime(
                session.started_at
            )
        )

        hour = (
            local_start.hour
        )

        weekday = (
            local_start.strftime(
                "%A"
            )
        )

        duration = (
            session.actual_duration
        )


        # ----------------------------------------------
        # Focus by hour
        # ----------------------------------------------

        hourly_focus[
            hour
        ] += duration


        # ----------------------------------------------
        # Focus by weekday
        # ----------------------------------------------

        weekday_focus[
            weekday
        ] += duration


        # ----------------------------------------------
        # Session length
        # ----------------------------------------------

        session_lengths.append(
            duration
        )


        # ----------------------------------------------
        # Category + time analysis
        #
        # Only possible when the FocusSession
        # is linked to a Planner task.
        # ----------------------------------------------

        if (
            session.task
            and session.task.category
        ):

            category = (
                session.task
                .category
                .strip()
            )

            if category:
                category_hour_focus[
                    category
                ][hour] += duration


    # --------------------------------------------------
    # Peak focus hour
    # --------------------------------------------------

    peak_hour = None

    if hourly_focus:
        peak_hour = max(
            hourly_focus,
            key=hourly_focus.get,
        )


    # --------------------------------------------------
    # Best / most-used focus day
    # --------------------------------------------------

    best_day = None

    if weekday_focus:
        best_day = max(
            weekday_focus,
            key=weekday_focus.get,
        )


    # --------------------------------------------------
    # Average session length
    # --------------------------------------------------

    average_session_minutes = 0

    if session_lengths:
        average_session_minutes = round(
            (
                sum(session_lengths)
                / len(session_lengths)
            )
            / 60
        )


    # --------------------------------------------------
    # Category-specific time patterns
    # --------------------------------------------------

    category_patterns = []

    for (
        category,
        hour_data,
    ) in category_hour_focus.items():

        if not hour_data:
            continue


        category_peak_hour = max(
            hour_data,
            key=hour_data.get,
        )

        total_seconds = sum(
            hour_data.values()
        )


        category_patterns.append(
            {
                "category":
                    category,

                "peak_hour":
                    category_peak_hour,

                "peak_time":
                    format_hour_window(
                        category_peak_hour
                    ),

                "tracked_minutes":
                    total_seconds // 60,
            }
        )


    # Most-used categories first

    category_patterns.sort(
        key=lambda item:
            item["tracked_minutes"],
        reverse=True,
    )


    # --------------------------------------------------
    # Final analysis response
    # --------------------------------------------------

    return {
        "available":
            True,

        "status":
            "ready",

        "insights": {

            "peak_focus": {

                "hour":
                    peak_hour,

                "time_window":
                    (
                        format_hour_window(
                            peak_hour
                        )
                        if peak_hour
                        is not None
                        else None
                    ),

                "tracked_minutes":
                    (
                        hourly_focus[
                            peak_hour
                        ] // 60
                        if peak_hour
                        is not None
                        else 0
                    ),
            },


            "best_day": {

                "day":
                    best_day,

                "tracked_minutes":
                    (
                        weekday_focus[
                            best_day
                        ] // 60
                        if best_day
                        else 0
                    ),
            },


            "session_pattern": {

                "average_minutes":
                    average_session_minutes,
            },


            "category_patterns":
                category_patterns,
        },
    }


# ==================================================
# TIME FORMATTING HELPERS
# ==================================================

def format_hour_window(hour):
    """
    Convert an integer hour into a readable
    one-hour time window.

    Example:
        19 -> "7 PM - 8 PM"
    """

    start = format_hour(
        hour
    )

    end_hour = (
        hour + 1
    ) % 24

    end = format_hour(
        end_hour
    )

    return (
        f"{start} - {end}"
    )


def format_hour(hour):
    """
    Convert 24-hour integer format into
    a readable 12-hour label.
    """

    if hour == 0:
        return "12 AM"

    if hour < 12:
        return (
            f"{hour} AM"
        )

    if hour == 12:
        return "12 PM"

    return (
        f"{hour - 12} PM"
    )


# ==================================================
# SESSION PERFORMANCE
# ==================================================

def calculate_session_performance(session):
    """
    Calculate a 0-100 performance score for a
    single valid focus session.

    Score:
    - 50 points: timer/session completion
    - 30 points: planned-duration adherence
    - 20 points: linked task completion

    This is a behavioral estimate, not a direct
    measurement of learning quality.
    """

    score = 0.0


    # --------------------------------------------------
    # 1. Session completion — 50 points
    # --------------------------------------------------

    if session.completed:
        score += 50


    # --------------------------------------------------
    # 2. Duration adherence — up to 30 points
    # --------------------------------------------------

    if (
        session.planned_duration
        and session.planned_duration > 0
    ):
        duration_ratio = min(
            session.actual_duration
            / session.planned_duration,
            1,
        )

        score += (
            duration_ratio * 30
        )

    else:
        # Stopwatch sessions don't have a planned
        # duration, so duration adherence cannot
        # be measured.
        #
        # Don't punish them for this.

        score += 30


    # --------------------------------------------------
    # 3. Planner task completion — 20 points
    # --------------------------------------------------

    if (
        session.task
        and session.task.completed
    ):
        score += 20


    return round(
        min(score, 100),
        1,
    )


# ==================================================
# STOPWATCH TRACKER STATUS
# ==================================================

def get_stopwatch_status(user):
    """
    Calculate Stopwatch analysis learning progress.

    A valid Stopwatch session:
    - belongs to the user
    - mode is stopwatch
    - has ended
    - contains at least 10 seconds of actual
      focused Stopwatch time

    Stopwatch analysis unlocks after
    10 valid Stopwatch sessions.
    """

    valid_sessions = (
        FocusSession.objects
        .filter(
            user=user,
            mode="stopwatch",
            ended_at__isnull=False,
            actual_duration__gte=
                STOPWATCH_MIN_SESSION_SECONDS,
        )
        .order_by("started_at")
    )


    # --------------------------------------------------
    # Valid session count
    # --------------------------------------------------

    session_count = (
        valid_sessions.count()
    )


    # --------------------------------------------------
    # Learning progress
    # --------------------------------------------------

    progress_percent = round(
        min(
            session_count
            / STOPWATCH_REQUIRED_SESSIONS,
            1,
        )
        * 100
    )


    # --------------------------------------------------
    # Unlock condition
    # --------------------------------------------------

    unlocked = (
        session_count
        >= STOPWATCH_REQUIRED_SESSIONS
    )


    # --------------------------------------------------
    # Tracker state
    # --------------------------------------------------

    if unlocked:
        status = "ready"

    elif session_count == 0:
        status = "not_started"

    else:
        status = "learning"


    # --------------------------------------------------
    # Response
    # --------------------------------------------------

    return {
        "status":
            status,

        "unlocked":
            unlocked,

        "tracked": {
            "sessions":
                session_count,
        },

        "requirements": {
            "sessions":
                STOPWATCH_REQUIRED_SESSIONS,

            "minimum_session_seconds":
                STOPWATCH_MIN_SESSION_SECONDS,
        },

        "remaining": {
            "sessions":
                max(
                    STOPWATCH_REQUIRED_SESSIONS
                    - session_count,
                    0,
                ),
        },

        "progress_percent":
            progress_percent,
    }


# ==================================================
# STOPWATCH ANALYSIS
# ==================================================

def get_stopwatch_analysis(user):
    """
    Analyze valid Stopwatch sessions.

    General Stopwatch analysis unlocks after
    10 valid Stopwatch sessions.

    Lap analysis remains optional. A user does
    not need to use Laps to unlock the general
    Stopwatch analysis.
    """

    tracker = get_stopwatch_status(
        user
    )


    # --------------------------------------------------
    # Stopwatch Tracker still learning
    # --------------------------------------------------

    if not tracker["unlocked"]:

        return {
            "available":
                False,

            "status":
                tracker["status"],

            "message":
                "Complete 10 valid stopwatch "
                "sessions to unlock your "
                "stopwatch insights.",

            "progress":
                tracker,

            "insights":
                None,
        }


    # --------------------------------------------------
    # Valid Stopwatch sessions
    # --------------------------------------------------

    sessions = list(
        FocusSession.objects
        .filter(
            user=user,

            mode="stopwatch",

            ended_at__isnull=False,

            actual_duration__gte=
                STOPWATCH_MIN_SESSION_SECONDS,
        )
        .prefetch_related("laps")
        .order_by("started_at")
    )


    session_count = len(
        sessions
    )


    # --------------------------------------------------
    # General Stopwatch statistics
    # --------------------------------------------------

    total_duration = sum(
        session.actual_duration
        for session in sessions
    )

    total_pauses = sum(
        session.pause_count
        for session in sessions
    )


    average_duration_seconds = round(
        total_duration
        / session_count
    )

    average_pauses = round(
        total_pauses
        / session_count,
        2,
    )


    # --------------------------------------------------
    # Lap collection
    # --------------------------------------------------

    all_laps = []

    sessions_with_laps = 0


    for session in sessions:

        session_laps = list(
            session.laps.all()
        )


        if session_laps:

            sessions_with_laps += 1

            all_laps.extend(
                session_laps
            )


    lap_count = len(
        all_laps
    )


    # --------------------------------------------------
    # Lap analysis
    # --------------------------------------------------

    if all_laps:

        total_lap_duration = sum(
            lap.duration
            for lap in all_laps
        )


        average_lap_duration = round(
            total_lap_duration
            / lap_count
        )


        fastest_lap = min(
            lap.duration
            for lap in all_laps
        )


        slowest_lap = max(
            lap.duration
            for lap in all_laps
        )


        # Important:
        #
        # Average lap count is calculated only
        # across sessions where Laps were actually
        # used.
        #
        # Sessions with zero laps should not make
        # lap usage appear artificially low.

        average_laps_per_used_session = round(
            lap_count
            / sessions_with_laps,
            2,
        )


        lap_analysis = {
            "available":
                True,

            "sessions_with_laps":
                sessions_with_laps,

            "total_laps":
                lap_count,

            "average_laps_per_session":
                average_laps_per_used_session,

            "average_lap_seconds":
                average_lap_duration,

            "fastest_lap_seconds":
                fastest_lap,

            "slowest_lap_seconds":
                slowest_lap,
        }


    else:

        # The Stopwatch analysis itself remains
        # available. Only the Lap subsection
        # has insufficient data.

        lap_analysis = {
            "available":
                False,

            "sessions_with_laps":
                0,

            "total_laps":
                0,

            "message":
                "No lap data yet. Try using "
                "Laps during a Stopwatch session "
                "to track your pace.",
        }


    # --------------------------------------------------
    # Final Stopwatch analysis
    # --------------------------------------------------

    return {
        "available":
            True,

        "status":
            "ready",

        "insights": {

            "sessions_analyzed":
                session_count,

            "average_session_seconds":
                average_duration_seconds,

            "average_pauses_per_session":
                average_pauses,

            "lap_analysis":
                lap_analysis,
        },
    }