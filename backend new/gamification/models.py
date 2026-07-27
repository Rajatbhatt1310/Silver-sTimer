from django.conf import settings
from django.db import models


class Achievement(models.Model):
    CATEGORY_CHOICES = [
        ("focus", "Focus"),
        ("streak", "Streak"),
        ("xp", "XP"),
        ("tasks", "Tasks"),
    ]

    code = models.CharField(
        max_length=50,
        unique=True,
    )

    title = models.CharField(
        max_length=100,
    )

    description = models.CharField(
        max_length=255,
    )

    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
    )

    icon = models.CharField(
        max_length=50,
        default="Trophy",
    )

    xp_reward = models.PositiveIntegerField(
        default=0,
    )

    def __str__(self):
        return self.title


class UserAchievement(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="achievements",
    )

    achievement = models.ForeignKey(
        Achievement,
        on_delete=models.CASCADE,
        related_name="unlocks",
    )

    unlocked_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "user",
                    "achievement",
                ],
                name="unique_user_achievement",
            )
        ]

        ordering = [
            "-unlocked_at",
        ]

    def __str__(self):
        return (
            f"{self.user.username} - "
            f"{self.achievement.title}"
        )