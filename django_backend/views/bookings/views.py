
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.dateparse import parse_datetime
from .models import Booking
from .serializers import BookingSerializer

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        # Ensure seats is a JSON array
        if isinstance(request.data.get('seats'), str):
            request.data['seats'] = request.data['seats'].split(',')
        
        return super().create(request, *args, **kwargs)

class TakenSeatsView(APIView):
    def get(self, request):
        movie_id = request.query_params.get('movie_id')
        showtime_str = request.query_params.get('showtime')
        
        if not movie_id or not showtime_str:
            return Response(
                {"message": "movie_id and showtime are required parameters"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Parse showtime string to datetime
        showtime = parse_datetime(showtime_str)
        if not showtime:
            return Response(
                {"message": "Invalid showtime format"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Find all bookings for this movie and showtime
        bookings = Booking.objects.filter(movie_id=movie_id, showtime=showtime)
        
        # Collect all seats from these bookings
        taken_seats = []
        for booking in bookings:
            taken_seats.extend(booking.seats)
        
        return Response({"taken_seats": taken_seats})
