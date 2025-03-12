
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

class BookingConfirmationEmailView(APIView):
    def post(self, request):
        email = request.data.get('email')
        booking_details = request.data.get('booking_details')
        
        if not email or not booking_details:
            return Response(
                {"message": "Email and booking details are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Render HTML email template
        html_message = render_to_string('emails/booking_confirmation.html', {
            'movie_title': booking_details.get('movie_title'),
            'showtime': booking_details.get('showtime'),
            'seats': booking_details.get('seats'),
            'amount': booking_details.get('amount'),
        })
        
        # Create plain text version
        plain_message = strip_tags(html_message)
        
        try:
            send_mail(
                subject=f"Your Movie Ticket Confirmation for {booking_details.get('movie_title')}",
                message=plain_message,
                from_email=None,  # uses DEFAULT_FROM_EMAIL from settings
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False,
            )
            return Response({"success": True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"success": False, "message": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
