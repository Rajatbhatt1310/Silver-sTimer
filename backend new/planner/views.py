import json
from json import JSONDecodeError
from django.utils.dateparse import parse_date
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404

from .models import Task


def serialize_task(task):
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "date": task.date.isoformat(),
        "start_time": (
            task.start_time.strftime("%H:%M")
            if task.start_time
            else None
        ),
        "duration": task.duration,
        "priority": task.priority,
        "category": task.category,
        "completed": task.completed,
        "created_at": task.created_at.isoformat(),
        "updated_at": task.updated_at.isoformat(),
    }


@login_required
def task_list_create(request):
    # GET /api/v1/planner/tasks/
    if request.method == "GET":
        tasks = Task.objects.filter(
            user=request.user
        )

        # Optional date filter
        date = request.GET.get("date")

        if date:
            tasks = tasks.filter(date=date)

        return JsonResponse({
            "tasks": [
                serialize_task(task)
                for task in tasks
            ]
        })

    # POST /api/v1/planner/tasks/
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except JSONDecodeError:
            return JsonResponse(
                {"error": "Invalid JSON."},
                status=400,
            )

        title = data.get("title", "").strip()
        description = data.get(
            "description",
            ""
        ).strip()

        date_string = data.get("date")

        date = (
                parse_date(date_string)
                if date_string
                else None
            )
        start_time = data.get("start_time")
        duration = data.get("duration")
        priority = data.get(
            "priority",
            "medium"
        )
        category = data.get(
            "category",
            ""
        ).strip()

        if not title:
            return JsonResponse(
                {"error": "Title is required."},
                status=400,
            )

        if not date_string:
            return JsonResponse(
                {"error": "Date is required."},
                status=400,
                 )

        if not date:
            return JsonResponse(
            {"error":
            "Invalid date. Use YYYY-MM-DD."
            },
                status=400,
             )

        if priority not in [
            "low",
            "medium",
            "high",
        ]:
            return JsonResponse(
                {"error": "Invalid priority."},
                status=400,
            )

        task = Task.objects.create(
            user=request.user,
            title=title,
            description=description,
            date=date,
            start_time=start_time or None,
            duration=duration,
            priority=priority,
            category=category,
        )

        return JsonResponse(
            {
                "message": "Task created successfully.",
                "task": serialize_task(task),
            },
            status=201,
        )

    return JsonResponse(
        {"error": "Method not allowed."},
        status=405,
    )


@login_required
def task_detail(request, task_id):
    # Important:
    # Users can only access their own tasks.
    task = get_object_or_404(
        Task,
        id=task_id,
        user=request.user,
    )

    # PATCH /api/v1/planner/tasks/<id>/
    if request.method == "PATCH":
        try:
            data = json.loads(request.body)
        except JSONDecodeError:
            return JsonResponse(
                {"error": "Invalid JSON."},
                status=400,
            )

        if "title" in data:
            title = data["title"].strip()

            if not title:
                return JsonResponse(
                    {
                        "error":
                        "Title cannot be empty."
                    },
                    status=400,
                )

            task.title = title

        if "description" in data:
            task.description = (
                data["description"].strip()
            )

        if "date" in data:
             parsed_date = parse_date(
        data["date"]
    )

        if not parsed_date:
            return JsonResponse(
            {
                "error":
                "Invalid date. Use YYYY-MM-DD."
            },
            status=400,
        )

        task.date = parsed_date

        if "start_time" in data:
            task.start_time = (
                data["start_time"] or None
            )

        if "duration" in data:
            task.duration = data["duration"]

        if "priority" in data:
            if data["priority"] not in [
                "low",
                "medium",
                "high",
            ]:
                return JsonResponse(
                    {
                        "error":
                        "Invalid priority."
                    },
                    status=400,
                )

            task.priority = data["priority"]

        if "category" in data:
            task.category = (
                data["category"].strip()
            )

        if "completed" in data:
            task.completed = bool(
                data["completed"]
            )

        task.save()

        return JsonResponse({
            "message":
                "Task updated successfully.",
            "task": serialize_task(task),
        })

    # DELETE /api/v1/planner/tasks/<id>/
    if request.method == "DELETE":
        task.delete()

        return JsonResponse({
            "message":
                "Task deleted successfully."
        })

    return JsonResponse(
        {"error": "Method not allowed."},
        status=405,
    )