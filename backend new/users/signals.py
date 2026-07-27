from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import UserProfile, UserStats


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Automatically create UserProfile and UserStats
    whenever a new Django User is created.
    """
    if created:
        UserProfile.objects.create(
            user=instance,
            full_name=instance.username,
        )

        UserStats.objects.create(
            user=instance,
        )