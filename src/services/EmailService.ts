
import { supabase } from '@/lib/supabase';

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
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Auth error:', userError);
      return { success: false, error: 'Authentication error' };
    }
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Format the showtime
    const formattedShowtime = new Date(bookingDetails.showtime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const { error: emailError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        data: {
          type: 'booking_confirmation',
          subject: `Movie Ticket Confirmation - ${bookingDetails.movieTitle}`,
          template: `
            <h1>Your Movie Tickets are Confirmed!</h1>
            <div style="margin: 20px 0;">
              <p>Thank you for booking with us. Here are your ticket details:</p>
              
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #1a1a1a; margin-bottom: 15px;">Booking Details</h2>
                <p><strong>Movie:</strong> ${bookingDetails.movieTitle}</p>
                <p><strong>Date & Time:</strong> ${formattedShowtime}</p>
                <p><strong>Seats:</strong> ${bookingDetails.seats.join(', ')}</p>
                <p><strong>Total Amount:</strong> $${bookingDetails.amount.toFixed(2)}</p>
              </div>
              
              <div style="margin: 20px 0;">
                <p>Please arrive at least 15 minutes before the show starts.</p>
                <p>Show this email at the counter to collect your tickets.</p>
              </div>
              
              <div style="margin-top: 30px;">
                <p style="color: #666;">Need help? Contact us at support@movietheater.com</p>
              </div>
            </div>
          `,
          movie_title: bookingDetails.movieTitle,
          showtime: formattedShowtime,
          seats: bookingDetails.seats.join(', '),
          amount: bookingDetails.amount,
          user_id: user.id
        }
      }
    });

    if (emailError) {
      console.error('Email error:', emailError);
      return { success: false, error: 'Failed to send email' };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error in sendBookingConfirmation:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};
