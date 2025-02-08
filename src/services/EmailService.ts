
import { supabase } from '@/lib/supabase';

export const sendBookingConfirmation = async (
  email: string,
  bookingDetails: {
    movieTitle: string;
    showtime: string;
    seats: string[];
    amount: number;
  }
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Send email using Supabase's signInWithOtp (which can be used for sending custom emails)
    const { error } = await supabase.auth.signInWithOtp({
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

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Failed to send booking confirmation:', error);
    throw error;
  }
};
