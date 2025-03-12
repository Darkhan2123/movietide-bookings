
import api from '@/lib/api';

interface BookingDetails {
  movieTitle: string;
  showtime: string;
  seats: string[];
  amount: number;
}

export const sendBookingConfirmation = async (
  email: string,
  bookingDetails: BookingDetails
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Format the showtime for display
    const formattedShowtime = new Date(bookingDetails.showtime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const response = await api.post('/emails/booking-confirmation/', {
      email,
      booking_details: {
        movie_title: bookingDetails.movieTitle,
        showtime: formattedShowtime,
        seats: bookingDetails.seats.join(', '),
        amount: bookingDetails.amount,
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error sending booking confirmation:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to send email confirmation'
    };
  }
};
