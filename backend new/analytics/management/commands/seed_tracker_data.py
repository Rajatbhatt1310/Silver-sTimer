import random
from datetime import datetime, time, timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils import timezone

from focus.models import FocusSession
from planner.models import Task


class Command(BaseCommand):
    help = "Create development data for Silver's Tracker"

    def add_arguments(self, parser):
        parser.add_argument(
            "username",
            type=str,
            help="Username/email of the development user",
        )

    def handle(self, *args, **options):
        username = options["username"]

        try:
            user = User.objects.get(
                username=username
            )
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(
                    f"User '{username}' not found."
                )
            )
            return

        today = timezone.localdate()

        patterns = [
            {
                "category": "Mathematics",
                "title": "Mathematics Practice",
                "hours": [18, 19, 20],
            },
            {
                "category": "Programming",
                "title": "Programming Practice",
                "hours": [8, 9, 10],
            },
            {
                "category": "Reading",
                "title": "Reading Session",
                "hours": [14, 15, 16],
            },
        ]

        sessions_created = 0
        total_seconds = 0

        # 10 active days
        for day_offset in range(10):
            session_date = (
                today
                - timedelta(days=day_offset)
            )

            # 3-4 sessions each day
            sessions_today = random.randint(
                3,
                4,
            )

            for index in range(
                sessions_today
            ):
                pattern = random.choice(
                    patterns
                )

                hour = random.choice(
                    pattern["hours"]
                )

                minute = random.choice(
                    [0, 15, 30, 45]
                )

                # 55-75 minute sessions.
                # This comfortably gives us >30h
                # across the generated dataset.
                duration_minutes = (
                    random.randint(55, 75)
                )

                task = Task.objects.create(
                    user=user,
                    title=(
                        f"{pattern['title']} "
                        f"{day_offset + 1}-"
                        f"{index + 1}"
                    ),
                    description=(
                        "Silver's Tracker "
                        "development test data"
                    ),
                    date=session_date,
                    start_time=time(
                        hour=hour,
                        minute=minute,
                    ),
                    duration=duration_minutes,
                    priority=random.choice(
                        [
                            "low",
                            "medium",
                            "high",
                        ]
                    ),
                    category=pattern[
                        "category"
                    ],
                    completed=True,
                )

                naive_start = datetime.combine(
                    session_date,
                    time(
                        hour=hour,
                        minute=minute,
                    ),
                )

                started_at = timezone.make_aware(
                    naive_start,
                    timezone.get_current_timezone(),
                )

                actual_seconds = (
                    duration_minutes * 60
                )

                ended_at = (
                    started_at
                    + timedelta(
                        seconds=actual_seconds
                    )
                )

                FocusSession.objects.create(
                    user=user,
                    task=task,
                    mode="custom",
                    planned_duration=(
                        duration_minutes * 60
                    ),
                    actual_duration=actual_seconds,
                    started_at=started_at,
                    ended_at=ended_at,
                    completed=True,
                )

                sessions_created += 1
                total_seconds += (
                    actual_seconds
                )

        self.stdout.write(
            self.style.SUCCESS(
                "\nSilver's Tracker test data created."
            )
        )

        self.stdout.write(
            f"Sessions: {sessions_created}"
        )

        self.stdout.write(
            f"Active days: 10"
        )

        self.stdout.write(
            f"Focus hours: "
            f"{round(total_seconds / 3600, 2)}"
        )

        self.stdout.write(
            "\nThis data is for development testing only."
        )