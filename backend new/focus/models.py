from django.contrib.auth.models import User
from django.db import models

from planner.models import Task


class FocusSession(models.Model):
    MODE_CHOICES = [
        ("pomodoro", "Pomodoro"),
        ("deep-work", "Deep Work"),
        ("custom", "Custom"),
        ("stopwatch", "Stopwatch"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="focus_sessions",
    )

    task = models.ForeignKey(
        Task,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="focus_sessions",
    )

    mode = models.CharField(
        max_length=20,
        choices=MODE_CHOICES,
    )

    planned_duration = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Planned duration in seconds",
    )

    actual_duration = models.PositiveIntegerField(
        default=0,
        help_text="Actual focus duration in seconds",
    )

    pause_count = models.PositiveIntegerField(
        default=0,
        help_text="Number of pauses during the session",
    )

    started_at = models.DateTimeField()

    ended_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    completed = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-started_at"]

    def __str__(self):
        return (
            f"{self.user.username} - "
            f"{self.mode} - "
            f"{self.started_at}"
        )


class StopwatchLap(models.Model):
    session = models.ForeignKey(
        FocusSession,
        on_delete=models.CASCADE,
        related_name="laps",
    )

    lap_number = models.PositiveIntegerField()

    duration = models.PositiveIntegerField(
        help_text="Lap duration in seconds",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["lap_number"]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "session",
                    "lap_number",
                ],
                name="unique_lap_per_session",
            )
        ]

    def __str__(self):
        return (
            f"Session {self.session_id} - "
            f"Lap {self.lap_number}"
        )