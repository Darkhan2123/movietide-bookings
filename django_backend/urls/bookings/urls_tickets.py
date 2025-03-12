
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import BookingViewSet

# Reuse the BookingViewSet for tickets endpoint
router = DefaultRouter()
router.register(r'', BookingViewSet, basename='ticket')

urlpatterns = router.urls
