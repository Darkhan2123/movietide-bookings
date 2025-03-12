
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/movies/', include('movies.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/seats/', include('bookings.urls_seats')),
    path('api/tickets/', include('bookings.urls_tickets')),
    path('api/emails/', include('users.urls_emails')),
]
