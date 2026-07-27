from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from notifications.services import (
    send_unfinished_planner_reminder,
)


class Command(BaseCommand):
    help = (
        "Send unfinished planner reminders "
        "to eligible Silver's Timer users."
    )


    def handle(self, *args, **options):

        users = (
            User.objects
            .filter(
                is_active=True,
            )
            .select_related(
                "profile"
            )
        )


        checked = 0
        reminders_created = 0
        emails_sent = 0
        skipped = 0
        errors = 0


        for user in users:

            checked += 1

            try:
                result = (
                    send_unfinished_planner_reminder(
                        user
                    )
                )

                if result.get("created"):
                    reminders_created += 1
                else:
                    skipped += 1

                if result.get("email_sent"):
                    emails_sent += 1


                self.stdout.write(
                    (
                        f"{user.username}: "
                        f"{result}"
                    )
                )


            except Exception as error:

                errors += 1

                self.stderr.write(
                    self.style.ERROR(
                        (
                            f"{user.username}: "
                            f"{error}"
                        )
                    )
                )


        self.stdout.write("")

        self.stdout.write(
            self.style.SUCCESS(
                (
                    "Planner reminder run complete — "
                    f"checked={checked}, "
                    f"created={reminders_created}, "
                    f"emails={emails_sent}, "
                    f"skipped={skipped}, "
                    f"errors={errors}"
                )
            )
        )