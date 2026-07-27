from django.contrib.auth.models import User
from django.db import models


class XPTransaction(models.Model):
    SOURCE_CHOICES = [
        ("focus_session", "Focus Session"),
        ("achievement", "Achievement"),
        ("daily_goal", "Daily Goal"),
        ("streak", "Streak"),
        ("system", "System"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="xp_transactions",
    )

    amount = models.PositiveIntegerField()

    source = models.CharField(
        max_length=30,
        choices=SOURCE_CHOICES,
        default="focus_session",
    )

    reference_id = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text=(
            "Optional ID of the object that "
            "generated this XP."
        ),
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
    )

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(
                fields=["user", "created_at"]
            ),
        ]

    def __str__(self):
        return (
            f"{self.user.username} "
            f"+{self.amount} XP "
            f"({self.source})"
        )