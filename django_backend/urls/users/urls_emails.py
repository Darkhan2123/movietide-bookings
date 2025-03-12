
from django.urls import path
from .email_views import BookingConfirmationEmailView

urlpatterns = [
    path('booking-confirmation/', BookingConfirmationEmailView.as_view(), name='booking-confirmation-email'),
]
