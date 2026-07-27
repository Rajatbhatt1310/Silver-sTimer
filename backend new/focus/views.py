import json
from json import JSONDecodeError

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone

from gamification.services import reward_completed_session
from planner.models import Task

from .models import (
    FocusSession,
    StopwatchLap,
)


# ==================================================
# SERIALIZERS
# ==================================================

def serialize_lap(lap):
    return {
        "id": lap.id,
        "lap_number": lap.lap_number,
        "duration": lap.duration,
        "created_at": lap.created_at.isoformat(),
    }


def serialize_session(session):
    return {
        "id": session.id,

        "task": session.task_id,

        "task_title": (
            session.task.title
            if session.task
            else None
        ),

        "mode": session.mode,

        "planned_duration":
            session.planned_duration,

        "actual_duration":
            session.actual_duration,

        "pause_count":
            session.pause_count,

        "started_at":
            session.started_at.isoformat(),

        "ended_at": (
            session.ended_at.isoformat()
            if session.ended_at
            else None
        ),

        "completed":
            session.completed,

        "laps": [
            serialize_lap(lap)
            for lap in session.laps.all()
        ],
    }


# ==================================================
# SESSION LIST / CREATE
# ==================================================

@login_required
def session_list_create(request):

    # --------------------------------------------------
    # GET /api/v1/focus/sessions/
    # --------------------------------------------------

    if request.method == "GET":

        sessions = (
            FocusSession.objects
            .filter(
                user=request.user
            )
            .select_related("task")
            .prefetch_related("laps")
        )

        return JsonResponse({
            "sessions": [
                serialize_session(session)
                for session in sessions
            ]
        })


    # --------------------------------------------------
    # POST /api/v1/focus/sessions/
    # --------------------------------------------------

    if request.method == "POST":

        try:
            data = json.loads(
                request.body
            )

        except JSONDecodeError:
            return JsonResponse(
                {
                    "error":
                        "Invalid JSON."
                },
                status=400,
            )


        # ----------------------------------------------
        # Validate mode
        # ----------------------------------------------

        mode = data.get(
            "mode"
        )

        allowed_modes = [
            "pomodoro",
            "deep-work",
            "custom",
            "stopwatch",
        ]

        if mode not in allowed_modes:
            return JsonResponse(
                {
                    "error":
                        "Invalid timer mode."
                },
                status=400,
            )


        # ----------------------------------------------
        # Optional Planner task
        # ----------------------------------------------

        task = None

        task_id = data.get(
            "task"
        )

        if task_id:

            task = get_object_or_404(
                Task,
                id=task_id,
                user=request.user,
            )


        # ----------------------------------------------
        # Planned duration
        # ----------------------------------------------

        planned_duration = (
            data.get(
                "planned_duration"
            )
        )

        if mode == "stopwatch":
            planned_duration = None


        # ----------------------------------------------
        # Create session
        # ----------------------------------------------

        session = (
            FocusSession.objects.create(
                user=request.user,

                task=task,

                mode=mode,

                planned_duration=
                    planned_duration,

                actual_duration=0,

                pause_count=0,

                started_at=
                    timezone.now(),

                completed=False,
            )
        )


        return JsonResponse(
            {
                "message":
                    "Focus session started.",

                "session":
                    serialize_session(
                        session
                    ),
            },
            status=201,
        )


    return JsonResponse(
        {
            "error":
                "Method not allowed."
        },
        status=405,
    )


# ==================================================
# SESSION UPDATE
# ==================================================

@login_required
def session_detail(
    request,
    session_id,
):

    session = get_object_or_404(
        FocusSession,
        id=session_id,
        user=request.user,
    )


    if request.method != "PATCH":
        return JsonResponse(
            {
                "error":
                    "Method not allowed."
            },
            status=405,
        )


    try:
        data = json.loads(
            request.body
        )

    except JSONDecodeError:
        return JsonResponse(
            {
                "error":
                    "Invalid JSON."
            },
            status=400,
        )


    # Remember previous completion state
    # so XP cannot be rewarded twice.

    was_completed = (
        session.completed
    )


    # --------------------------------------------------
    # Actual focused duration
    # --------------------------------------------------

    if "actual_duration" in data:

        try:
            session.actual_duration = max(
                0,
                int(
                    data[
                        "actual_duration"
                    ]
                ),
            )

        except (
            TypeError,
            ValueError,
        ):
            return JsonResponse(
                {
                    "error":
                        "Invalid actual duration."
                },
                status=400,
            )


    # --------------------------------------------------
    # Pause count
    # --------------------------------------------------

    if "pause_count" in data:

        try:
            session.pause_count = max(
                0,
                int(
                    data[
                        "pause_count"
                    ]
                ),
            )

        except (
            TypeError,
            ValueError,
        ):
            return JsonResponse(
                {
                    "error":
                        "Invalid pause count."
                },
                status=400,
            )


    # --------------------------------------------------
    # Completion
    # --------------------------------------------------

    if "completed" in data:

        session.completed = bool(
            data[
                "completed"
            ]
        )


    # --------------------------------------------------
    # End session
    # --------------------------------------------------

    if data.get(
        "ended"
    ):
        session.ended_at = (
            timezone.now()
        )


    session.save()


    # --------------------------------------------------
    # Gamification rewards
    # --------------------------------------------------

    rewards = None

    # Reward only:
    #
    # false -> true
    #
    # Prevents duplicate XP when completion
    # requests are accidentally repeated.

    if (
        not was_completed
        and session.completed
    ):

        rewards = (
            reward_completed_session(
                request.user,
                session.actual_duration,
            )
        )


    return JsonResponse({
        "message":
            "Focus session updated.",

        "session":
            serialize_session(
                session
            ),

        "rewards":
            rewards,
    })


# ==================================================
# STOPWATCH LAP CREATE
# ==================================================

@login_required
def create_stopwatch_lap(
    request,
    session_id,
):

    if request.method != "POST":
        return JsonResponse(
            {
                "error":
                    "Method not allowed."
            },
            status=405,
        )


    # --------------------------------------------------
    # Session must belong to logged-in user
    # --------------------------------------------------

    session = get_object_or_404(
        FocusSession,
        id=session_id,
        user=request.user,
    )


    # --------------------------------------------------
    # Laps only make sense for Stopwatch
    # --------------------------------------------------

    if session.mode != "stopwatch":
        return JsonResponse(
            {
                "error":
                    "Laps can only be saved "
                    "for stopwatch sessions."
            },
            status=400,
        )


    # Don't allow new laps after session ends.

    if session.ended_at:
        return JsonResponse(
            {
                "error":
                    "This stopwatch session "
                    "has already ended."
            },
            status=400,
        )


    # --------------------------------------------------
    # Parse request
    # --------------------------------------------------

    try:
        data = json.loads(
            request.body
        )

    except JSONDecodeError:
        return JsonResponse(
            {
                "error":
                    "Invalid JSON."
            },
            status=400,
        )


    # --------------------------------------------------
    # Validate lap duration
    # --------------------------------------------------

    try:
        duration = int(
            data.get(
                "duration",
                0,
            )
        )

    except (
        TypeError,
        ValueError,
    ):
        return JsonResponse(
            {
                "error":
                    "Invalid lap duration."
            },
            status=400,
        )


    if duration <= 0:
        return JsonResponse(
            {
                "error":
                    "Lap duration must be "
                    "greater than zero."
            },
            status=400,
        )


    # --------------------------------------------------
    # Determine next lap number on backend
    # --------------------------------------------------

    last_lap = (
        session.laps
        .order_by(
            "-lap_number"
        )
        .first()
    )

    next_lap_number = (
        last_lap.lap_number + 1
        if last_lap
        else 1
    )


    # --------------------------------------------------
    # Create lap
    # --------------------------------------------------

    lap = StopwatchLap.objects.create(
        session=session,

        lap_number=
            next_lap_number,

        duration=duration,
    )


    return JsonResponse(
        {
            "message":
                "Stopwatch lap saved.",

            "lap":
                serialize_lap(
                    lap
                ),
        },
        status=201,
    )