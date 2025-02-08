
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

    // Insert booking email data into a dedicated table
    // This will trigger an email via Supabase Edge Functions or Webhooks
    const { error } = await supabase
      .from('booking_emails')
      .insert({
        user_id: user.id,
        email: email,
        movie_title: bookingDetails.movieTitle,
        showtime: bookingDetails.showtime,
        seats: bookingDetails.seats,
        amount: bookingDetails.amount,
        status: 'pending'
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Failed to send booking confirmation:', error);
    throw error;
  }
};
