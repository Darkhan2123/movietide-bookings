
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

    // Using email send functionality
    const { error } = await supabase.from('email_queue').insert({
      recipient: email,
      template: 'BOOKING_CONFIRMATION',
      booking_details: {
        ...bookingDetails,
        userId: user.id,
      }
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Failed to send booking confirmation:', error);
    throw error;
  }
};
