from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from notifications.models import Notification


class Command(BaseCommand):
    help = (
        "Send the Stopwatch feature tip "
        "to all users."
    )

    def handle(self, *args, **options):
        created_count = 0
        skipped_count = 0

        users = User.objects.all()

        for user in users:
            _, created = (
                Notification.objects.get_or_create(
                    user=user,
                    notification_type="feature_tip",
                    title="Solving questions? Try Stopwatch",
                    defaults={
                        "message": (
                            "Track your solving time, "
                            "use laps for individual "
                            "questions, and discover "
                            "your pace over time."
                        ),
                        "action_url": (
                            "/focus?mode=stopwatch"
                        ),
                    },
                )
            )

            if created:
                created_count += 1
            else:
                skipped_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                "Stopwatch tip processed."
            )
        )

        self.stdout.write(
            f"Created: {created_count}"
        )

        self.stdout.write(
            f"Already existed: {skipped_count}"
        )