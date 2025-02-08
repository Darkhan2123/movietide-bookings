
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

    // Send email using Supabase's email functionality
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: {
          type: 'booking_confirmation',
          booking_details: {
            ...bookingDetails,
            userId: user.id,
          }
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
