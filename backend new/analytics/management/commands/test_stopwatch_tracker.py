from datetime import timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils import timezone

from focus.models import (
    FocusSession,
    StopwatchLap,
)


TEST_USERNAME = "stopwatch_tracker_test"


class Command(BaseCommand):
    help = (
        "Creates temporary Stopwatch data "
        "for testing Stopwatch Tracker."
    )


    def handle(self, *args, **options):

        # ---------------------------------------------
        # Remove previous test account
        # ---------------------------------------------

        User.objects.filter(
            username=TEST_USERNAME
        ).delete()


        # ---------------------------------------------
        # Create isolated test user
        # ---------------------------------------------

        user = User.objects.create_user(
            username=TEST_USERNAME,
            password="tracker-test-only",
        )


        now = timezone.now()


        # ---------------------------------------------
        # Test data
        # ---------------------------------------------
        #
        # All sessions are >= 10 sec.
        #
        # Some have laps.
        # Some intentionally have no laps.
        # Pause counts vary.
        # ---------------------------------------------

        session_data = [
            {
                "duration": 600,
                "pauses": 1,
                "laps": [120, 150, 130],
            },
            {
                "duration": 720,
                "pauses": 2,
                "laps": [180, 160, 140],
            },
            {
                "duration": 480,
                "pauses": 0,
                "laps": [],
            },
            {
                "duration": 900,
                "pauses": 3,
                "laps": [200, 170, 190, 160],
            },
            {
                "duration": 540,
                "pauses": 1,
                "laps": [],
            },
            {
                "duration": 660,
                "pauses": 2,
                "laps": [110, 130],
            },
            {
                "duration": 780,
                "pauses": 1,
                "laps": [150, 145, 155],
            },
            {
                "duration": 840,
                "pauses": 4,
                "laps": [],
            },
            {
                "duration": 510,
                "pauses": 0,
                "laps": [100, 125],
            },
            {
                "duration": 750,
                "pauses": 2,
                "laps": [175, 165, 185],
            },
        ]


        # ---------------------------------------------
        # Create sessions
        # ---------------------------------------------

        for index, data in enumerate(
            session_data
        ):

            started_at = (
                now
                - timedelta(
                    days=10 - index
                )
            )

            ended_at = (
                started_at
                + timedelta(
                    seconds=data[
                        "duration"
                    ]
                )
            )


            session = (
                FocusSession.objects.create(
                    user=user,

                    task=None,

                    mode="stopwatch",

                    planned_duration=None,

                    actual_duration=
                        data["duration"],

                    pause_count=
                        data["pauses"],

                    started_at=
                        started_at,

                    ended_at=
                        ended_at,

                    completed=False,
                )
            )


            # -----------------------------------------
            # Create laps
            # -----------------------------------------

            for (
                lap_index,
                lap_duration,
            ) in enumerate(
                data["laps"],
                start=1,
            ):

                StopwatchLap.objects.create(
                    session=session,

                    lap_number=
                        lap_index,

                    duration=
                        lap_duration,
                )


        self.stdout.write(
            self.style.SUCCESS(
                "\nStopwatch Tracker "
                "test data created."
            )
        )

        self.stdout.write(
            f"User: {TEST_USERNAME}"
        )

        self.stdout.write(
            "Valid sessions: 10"
        )

        self.stdout.write(
            "This account is TEST DATA ONLY.\n"
        )