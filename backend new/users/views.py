import json
from json import JSONDecodeError

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

from .models import UserProfile


def serialize_notification_preferences(profile):
    return {
        "email_notifications":
            profile.email_notifications,

        "planner_notifications":
            profile.planner_notifications,

        "study_reminders":
            profile.study_reminders,
    }


@login_required
def notification_preferences(request):
    profile, _ = UserProfile.objects.get_or_create(
        user=request.user,
        defaults={
            "full_name":
                request.user.get_full_name()
                or request.user.username
        },
    )


    # ==================================================
    # GET
    # ==================================================

    if request.method == "GET":

        return JsonResponse({
            "preferences":
                serialize_notification_preferences(
                    profile
                )
        })


    # ==================================================
    # PATCH
    # ==================================================

    if request.method == "PATCH":

        try:
            data = json.loads(
                request.body or "{}"
            )

        except JSONDecodeError:
            return JsonResponse(
                {
                    "error":
                        "Invalid JSON."
                },
                status=400,
            )


        allowed_fields = {
            "email_notifications",
            "planner_notifications",
            "study_reminders",
        }


        updated_fields = []


        for field in allowed_fields:

            if field not in data:
                continue


            value = data[field]


            if not isinstance(
                value,
                bool,
            ):
                return JsonResponse(
                    {
                        "error":
                            f"{field} must be true or false."
                    },
                    status=400,
                )


            setattr(
                profile,
                field,
                value,
            )

            updated_fields.append(
                field
            )


        if updated_fields:

            updated_fields.append(
                "updated_at"
            )

            profile.save(
                update_fields=
                    updated_fields
            )


        return JsonResponse({
            "message":
                "Notification preferences updated.",

            "preferences":
                serialize_notification_preferences(
                    profile
                ),
        })


    # ==================================================
    # METHOD NOT ALLOWED
    # ==================================================

    return JsonResponse(
        {
            "error":
                "Method not allowed."
        },
        status=405,
    )