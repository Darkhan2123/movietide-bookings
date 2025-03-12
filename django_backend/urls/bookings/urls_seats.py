
from django.urls import path
from .views import TakenSeatsView

urlpatterns = [
    path('taken/', TakenSeatsView.as_view(), name='taken-seats'),
]
