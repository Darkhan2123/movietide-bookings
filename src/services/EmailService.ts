
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

    const { data, error } = await supabase.functions.invoke('send-booking-email', {
      body: {
        to: email,
        booking: {
          ...bookingDetails,
          userId: user.id,
        },
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to send booking confirmation:', error);
    throw error;
  }
};
