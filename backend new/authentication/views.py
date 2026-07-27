import json
from json import JSONDecodeError

from django.http import JsonResponse

from django.middleware.csrf import get_token
from .services import (
    register_user,
    login_user,
    logout_user,
)

from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def csrf(request):
    token = get_token(request)

    return JsonResponse({
        "csrfToken": token
    })


def signup(request):
    if request.method != "POST":
        return JsonResponse(
            {
                "error":
                "Only POST requests are allowed."
            },
            status=405,
        )

    try:
        data = json.loads(request.body)
    except JSONDecodeError:
        return JsonResponse(
            {
                "error": "Invalid JSON."
            },
            status=400,
        )

    success, result = register_user(
        request,
        data,
    )

    if not success:
        return JsonResponse(
            {
                "error": result
            },
            status=400,
        )

    user = result

    return JsonResponse(
        {
            "message":
                "Account created successfully.",

            "user": {
                "id": user.id,
                "full_name":
                    user.profile.full_name,
                "username":
                    user.username,
                "email":
                    user.email,
            },
        }
    )


def login_view(request):
    if request.method != "POST":
        return JsonResponse(
            {
                "error":
                "Only POST requests are allowed."
            },
            status=405,
        )

    try:
        data = json.loads(request.body)
    except JSONDecodeError:
        return JsonResponse(
            {
                "error": "Invalid JSON."
            },
            status=400,
        )

    success, result = login_user(
        request,
        data,
    )

    if not success:
        return JsonResponse(
            {
                "error": result
            },
            status=400,
        )

    user = result

    return JsonResponse(
        {
            "message":
                "Login successful.",

            "user": {
                "id": user.id,
                "full_name":
                    user.profile.full_name,
                "username":
                    user.username,
                "email":
                    user.email,
            },
        }
    )


def logout_view(request):
    if request.method != "POST":
        return JsonResponse(
            {
                "error":
                    "Only POST requests are allowed."
            },
            status=405,
        )

    if not request.user.is_authenticated:
        return JsonResponse(
            {
                "error":
                    "Authentication required."
            },
            status=401,
        )

    logout_user(request)

    return JsonResponse(
        {
            "message":
                "Logged out successfully."
        }
    )


def me(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {
                "error":
                    "Authentication required."
            },
            status=401,
        )

    user = request.user

    return JsonResponse(
        {
            "id": user.id,
            "full_name":
                user.profile.full_name,
            "username":
                user.username,
            "email":
                user.email,
        }
    )

def delete_account(request):
    if request.method != "DELETE":
        return JsonResponse(
            {
                "error":
                    "Only DELETE requests are allowed."
            },
            status=405,
        )

    if not request.user.is_authenticated:
        return JsonResponse(
            {
                "error":
                    "Authentication required."
            },
            status=401,
        )

    user = request.user

    # End the active Django session first.
    logout_user(request)

    # Deleting the User will cascade-delete
    # related models configured with CASCADE.
    user.delete()

    return JsonResponse(
        {
            "message":
                "Account deleted successfully."
        }
    )

def change_password(request):
    if request.method != "POST":
        return JsonResponse(
            {
                "error":
                    "Only POST requests are allowed."
            },
            status=405,
        )

    if not request.user.is_authenticated:
        return JsonResponse(
            {
                "error":
                    "Authentication required."
            },
            status=401,
        )

    try:
        data = json.loads(request.body)

    except JSONDecodeError:
        return JsonResponse(
            {
                "error":
                    "Invalid JSON."
            },
            status=400,
        )


    current_password = data.get(
        "current_password",
        ""
    )

    new_password = data.get(
        "new_password",
        ""
    )

    confirm_password = data.get(
        "confirm_password",
        ""
    )


    # ----------------------------------------------
    # Required fields
    # ----------------------------------------------

    if not current_password:
        return JsonResponse(
            {
                "error":
                    "Current password is required."
            },
            status=400,
        )

    if not new_password:
        return JsonResponse(
            {
                "error":
                    "New password is required."
            },
            status=400,
        )

    if not confirm_password:
        return JsonResponse(
            {
                "error":
                    "Please confirm your new password."
            },
            status=400,
        )


    # ----------------------------------------------
    # Verify current password
    # ----------------------------------------------

    user = request.user

    if not user.check_password(
        current_password
    ):
        return JsonResponse(
            {
                "error":
                    "Current password is incorrect."
            },
            status=400,
        )


    # ----------------------------------------------
    # Password confirmation
    # ----------------------------------------------

    if new_password != confirm_password:
        return JsonResponse(
            {
                "error":
                    "New passwords do not match."
            },
            status=400,
        )


    # ----------------------------------------------
    # Prevent same password
    # ----------------------------------------------

    if user.check_password(
        new_password
    ):
        return JsonResponse(
            {
                "error":
                    "New password must be different from your current password."
            },
            status=400,
        )


    # ----------------------------------------------
    # Django password validation
    # ----------------------------------------------

    from django.contrib.auth.password_validation import (
        validate_password,
    )

    from django.core.exceptions import (
        ValidationError,
    )

    try:
        validate_password(
            new_password,
            user=user,
        )

    except ValidationError as error:
        return JsonResponse(
            {
                "error":
                    error.messages[0]
            },
            status=400,
        )


    # ----------------------------------------------
    # Change password
    # ----------------------------------------------

    user.set_password(
        new_password
    )

    user.save(
        update_fields=[
            "password"
        ]
    )


    # ----------------------------------------------
    # Keep current session logged in
    # ----------------------------------------------

    from django.contrib.auth import (
        update_session_auth_hash,
    )

    update_session_auth_hash(
        request,
        user,
    )


    return JsonResponse(
        {
            "message":
                "Password changed successfully."
        }
    )