
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

    const { error: emailError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        data: {
          type: 'booking_confirmation',
          movie_title: bookingDetails.movieTitle,
          showtime: bookingDetails.showtime,
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
