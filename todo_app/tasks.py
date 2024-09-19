# tasks.py using Celery or Django management command
from django.utils import timezone
from .models import Banner

def update_expired_banners():
    banners = Banner.objects.filter(expiry_date__lt=timezone.now().date(), expired=False)
    for banner in banners:
        banner.expired = True
        banner.save()
