import json
from json import JSONDecodeError
from .models import Notification
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from .models import Notification


def serialize_notification(notification):
    return {
        "id": notification.id,
        "type": notification.notification_type,
        "title": notification.title,
        "message": notification.message,
        "is_read": notification.is_read,
        "action_url": notification.action_url,
        "created_at": notification.created_at.isoformat(),
    }


@login_required
def notification_list(request):
    if request.method != "GET":
        return JsonResponse(
            {"error": "Method not allowed."},
            status=405,
        )

    notifications = Notification.objects.filter(
        user=request.user
    )

    unread_count = notifications.filter(
        is_read=False
    ).count()

    return JsonResponse({
        "notifications": [
            serialize_notification(notification)
            for notification in notifications
        ],
        "unread_count": unread_count,
    })


@login_required
def notification_detail(request, notification_id):
    if request.method != "PATCH":
        return JsonResponse(
            {"error": "Method not allowed."},
            status=405,
        )

    notification = get_object_or_404(
        Notification,
        id=notification_id,
        user=request.user,
    )

    try:
        data = json.loads(
            request.body or "{}"
        )
    except JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON."},
            status=400,
        )

    if "is_read" in data:
        notification.is_read = bool(
            data["is_read"]
        )

        notification.save(
            update_fields=[
                "is_read",
            ]
        )

    return JsonResponse({
        "notification":
            serialize_notification(
                notification
            )
    })


@login_required
def mark_all_read(request):
    if request.method != "POST":
        return JsonResponse(
            {"error": "Method not allowed."},
            status=405,
        )

    updated = (
        Notification.objects
        .filter(
            user=request.user,
            is_read=False,
        )
        .update(
            is_read=True
        )
    )

    return JsonResponse({
        "message":
            "Notifications marked as read.",
        "updated": updated,
    })