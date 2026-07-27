from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.utils import timezone

from planner.models import Task

from .models import Notification


# ============================================================
# EMAIL PERMISSION
# ============================================================

def can_send_email(user):
    """
    Returns True only when the user:
    - has an email address
    - has a profile
    - has email notifications enabled
    """

    if not user.email:
        return False

    try:
        profile = user.profile
    except Exception:
        return False

    return profile.email_notifications


# ============================================================
# GENERIC EMAIL SENDER
# ============================================================

def send_notification_email(
    user,
    subject,
    text_message,
    html_message=None,
):
    """
    Central email sender for Silver's Timer.

    Returns True when an email was successfully handed
    to the configured email backend.
    """

    if not can_send_email(user):
        return False

    try:
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
        )

        if html_message:
            email.attach_alternative(
                html_message,
                "text/html",
            )

        sent_count = email.send(
            fail_silently=False
        )

        return sent_count == 1

    except Exception as error:
        print(
            f"Email sending failed for user "
            f"{user.id}: {error}"
        )

        return False


# ============================================================
# IN-APP NOTIFICATION
# ============================================================

def create_notification(
    user,
    notification_type,
    title,
    message,
    action_url="",
):
    return Notification.objects.create(
        user=user,
        notification_type=notification_type,
        title=title,
        message=message,
        action_url=action_url,
    )


# ============================================================
# PLANNER REMINDER EMAIL HTML
# ============================================================

def build_planner_email_html(
    user,
    unfinished_tasks,
):
    task_count = len(
        unfinished_tasks
    )

    name = (
        getattr(
            user.profile,
            "full_name",
            "",
        )
        or user.username
    )

    task_rows = ""

    for task in unfinished_tasks[:5]:
        task_rows += f"""
            <div style="
                padding: 12px 0;
                border-bottom: 1px solid #27272a;
            ">
                <div style="
                    color: #f4f4f5;
                    font-size: 14px;
                    font-weight: 600;
                ">
                    {task.title}
                </div>

                <div style="
                    color: #71717a;
                    font-size: 12px;
                    margin-top: 4px;
                ">
                    Priority: {task.get_priority_display()}
                </div>
            </div>
        """

    remaining_count = (
        task_count - 5
    )

    more_tasks = ""

    if remaining_count > 0:
        more_tasks = f"""
            <p style="
                color: #71717a;
                font-size: 12px;
                margin-top: 14px;
            ">
                + {remaining_count} more task{
                    "s"
                    if remaining_count != 1
                    else ""
                }
            </p>
        """

    return f"""
    <!DOCTYPE html>

    <html>
        <body style="
            margin: 0;
            padding: 0;
            background: #09090b;
            font-family:
                Arial,
                Helvetica,
                sans-serif;
        ">

            <div style="
                max-width: 560px;
                margin: 0 auto;
                padding: 40px 20px;
            ">

                <div style="
                    background: #111113;
                    border: 1px solid #27272a;
                    border-radius: 18px;
                    padding: 28px;
                ">

                    <div style="
                        color: #10b981;
                        font-size: 14px;
                        font-weight: 700;
                        margin-bottom: 22px;
                    ">
                        Silver's Timer
                    </div>


                    <h1 style="
                        color: #fafafa;
                        font-size: 22px;
                        margin: 0 0 10px;
                    ">
                        You still have work planned
                        for today.
                    </h1>


                    <p style="
                        color: #a1a1aa;
                        font-size: 14px;
                        line-height: 1.6;
                        margin: 0 0 24px;
                    ">
                        Hey {name}, you have
                        {task_count} unfinished
                        task{
                            "s"
                            if task_count != 1
                            else ""
                        } waiting in your planner.
                    </p>


                    <div style="
                        border-top: 1px solid #27272a;
                    ">

                        {task_rows}

                    </div>


                    {more_tasks}


                    <div style="
                        margin-top: 26px;
                        padding-top: 20px;
                        border-top: 1px solid #27272a;
                    ">

                        <p style="
                            color: #71717a;
                            font-size: 12px;
                            line-height: 1.5;
                            margin: 0;
                        ">
                            Small progress still counts.
                            Pick one task and get started.
                        </p>

                    </div>

                </div>


                <p style="
                    color: #52525b;
                    font-size: 11px;
                    text-align: center;
                    margin-top: 18px;
                ">
                    Silver's Timer · Focus on what matters
                </p>

            </div>

        </body>
    </html>
    """


# ============================================================
# TODAY'S UNFINISHED PLANNER REMINDER
# ============================================================

def send_unfinished_planner_reminder(
    user,
):
    """
    Sends a reminder about unfinished tasks scheduled
    for today.

    Creates an in-app notification and optionally sends
    email depending on the user's preferences.
    """

    today = timezone.localdate()


    # --------------------------------------------------------
    # Preference
    # --------------------------------------------------------

    try:
        profile = user.profile
    except Exception:
        return {
            "created": False,
            "email_sent": False,
            "reason": "missing_profile",
        }


    if not profile.planner_notifications:
        return {
            "created": False,
            "email_sent": False,
            "reason":
                "planner_notifications_disabled",
        }


    # --------------------------------------------------------
    # Find unfinished tasks
    # --------------------------------------------------------

    unfinished_tasks = list(
    Task.objects.filter(
        user=user,
        date=today,
        completed=False,
    ).order_by(
        "priority",
        "start_time",
        "created_at",
    )
)


    if not unfinished_tasks:
        return {
            "created": False,
            "email_sent": False,
            "reason":
                "no_unfinished_tasks",
        }


    task_count = len(
        unfinished_tasks
    )


    # --------------------------------------------------------
    # Prevent duplicate reminder on the same day
    # --------------------------------------------------------

    already_sent_today = (
        Notification.objects.filter(
            user=user,
            notification_type="planner",
            title="Today's tasks are waiting",
            created_at__date=today,
        ).exists()
    )


    if already_sent_today:
        return {
            "created": False,
            "email_sent": False,
            "reason":
                "already_sent_today",
        }


    # --------------------------------------------------------
    # In-app notification
    # --------------------------------------------------------

    if task_count == 1:
        message = (
            "You still have 1 unfinished task "
            "planned for today."
        )

    else:
        message = (
            f"You still have {task_count} unfinished "
            f"tasks planned for today."
        )


    create_notification(
        user=user,
        notification_type="planner",
        title="Today's tasks are waiting",
        message=message,
        action_url="/planner",
    )


    # --------------------------------------------------------
    # Email preference
    # --------------------------------------------------------

    email_sent = False


    if profile.email_notifications:

        subject = (
            f"You have {task_count} task"
            f"{'s' if task_count != 1 else ''} "
            f"left today | Silver's Timer"
        )


        text_message = (
            f"You have {task_count} unfinished "
            f"task{'s' if task_count != 1 else ''} "
            f"planned for today.\n\n"
            f"Open Silver's Timer and finish "
            f"what's left in your planner."
        )


        html_message = (
            build_planner_email_html(
                user=user,
                unfinished_tasks=
                    unfinished_tasks,
            )
        )


        email_sent = (
            send_notification_email(
                user=user,
                subject=subject,
                text_message=text_message,
                html_message=html_message,
            )
        )


    return {
        "created": True,
        "email_sent":
            email_sent,
        "task_count":
            task_count,
    }