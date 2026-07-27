from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import IntegrityError


def register_user(request, data):
    full_name = data.get("full_name", "").strip()
    username = data.get("username", "").strip().lower()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    confirm_password = data.get("confirm_password", "")

    if not full_name:
        return False, "Full name is required."

    if not username:
        return False, "Username is required."

    if not email:
        return False, "Email is required."

    if password != confirm_password:
        return False, "Passwords do not match."

    if len(password) < 8:
        return False, "Password must contain at least 8 characters."

    if User.objects.filter(username=username).exists():
        return False, "Username already exists."

    if User.objects.filter(email=email).exists():
        return False, "Email already exists."

    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )

        user.profile.full_name = full_name
        user.profile.save()

        login(request, user)

        return True, user

    except IntegrityError:
        return False, "Unable to create account."


def login_user(request, data):
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return False, "Invalid email or password."

    user = authenticate(
        request,
        username=user.username,
        password=password,
    )

    if user is None:
        return False, "Invalid email or password."

    login(request, user)

    return True, user


def logout_user(request):
    logout(request)