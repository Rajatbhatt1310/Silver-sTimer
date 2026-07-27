from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    """
    Stores user's personal information and preferences.
    """

    THEME_CHOICES = [
        ("dark", "Dark"),
        ("light", "Light"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    full_name = models.CharField(max_length=120)

    bio = models.TextField(
        blank=True,
        null=True,
    )

    avatar = models.ImageField(
        upload_to="avatars/",
        blank=True,
        null=True,
    )

    theme = models.CharField(
        max_length=10,
        choices=THEME_CHOICES,
        default="dark",
    )

    timezone = models.CharField(
        max_length=50,
        default="Asia/Kolkata",
    )

    email_notifications = models.BooleanField(default=True)

    planner_notifications = models.BooleanField(default=True)

    study_reminders = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name


class UserStats(models.Model):
    """
    Stores everything related to user productivity.
    """

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="stats",
    )

    xp = models.PositiveIntegerField(default=0)

    level = models.PositiveIntegerField(default=1)

    current_streak = models.PositiveIntegerField(default=0)

    longest_streak = models.PositiveIntegerField(default=0)

    total_study_minutes = models.PositiveIntegerField(default=0)

    today_minutes = models.PositiveIntegerField(default=0)

    week_minutes = models.PositiveIntegerField(default=0)

    month_minutes = models.PositiveIntegerField(default=0)

    year_minutes = models.PositiveIntegerField(default=0)

    focus_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=100.00,
    )

    completed_sessions = models.PositiveIntegerField(default=0)

    completed_tasks = models.PositiveIntegerField(default=0)

    last_study_date = models.DateField(
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} Stats"