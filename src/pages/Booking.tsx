
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMovieDetails } from '@/services/tmdb';
import { Button } from '@/components/ui/button';
import { format, addDays, isSameDay } from 'date-fns';
import SeatMap from '@/components/SeatMap';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const SHOWTIMES = ['10:00', '13:00', '16:00', '19:00', '22:00'];

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const { data: movieData, isLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieDetails(id!),
  });

  const handleBooking = async () => {
    if (!selectedTime || selectedSeats.length === 0) {
      toast.error('Please select time and seats');
      return;
    }

    if (!user) {
      toast.error('Please sign in to book tickets');
      return;
    }

    try {
      const showtime = `${format(selectedDate, 'yyyy-MM-dd')} ${selectedTime}`;
      const amount = selectedSeats.length * 12;

      const { error } = await supabase
        .from('tickets')
        .insert({
          user_id: user.id,
          movie_id: id,
          movie_title: movieData?.data.title,
          showtime,
          seats: selectedSeats,
          amount,
        });

      if (error) throw error;

      // Navigate to confirmation page with booking details
      navigate('/booking-confirmation', {
        state: {
          movieTitle: movieData?.data.title,
          showtime,
          seats: selectedSeats,
          amount,
        }
      });
      
    } catch (error) {
      toast.error('Failed to book tickets. Please try again.');
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  const movie = movieData?.data;
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">{movie.title}</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Date</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {dates.map((date) => (
            <Button
              key={date.toISOString()}
              variant={isSameDay(date, selectedDate) ? "default" : "outline"}
              onClick={() => setSelectedDate(date)}
              className="min-w-[100px]"
            >
              {format(date, 'EEE')}<br />
              {format(date, 'd MMM')}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Time</h2>
        <div className="flex gap-4 flex-wrap">
          {SHOWTIMES.map((time) => (
            <Button
              key={time}
              variant={time === selectedTime ? "default" : "outline"}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </Button>
          ))}
        </div>
      </div>

      {selectedTime && (
        <>
          <h2 className="text-xl font-semibold mb-4">Select Seats</h2>
          <SeatMap 
            onSeatSelect={setSelectedSeats} 
            movieId={id!}
            showtime={`${format(selectedDate, 'yyyy-MM-dd')} ${selectedTime}`}
          />
          
          <div className="mt-8 flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">Selected Seats: {selectedSeats.join(', ')}</p>
              <p className="text-lg">Total: ${selectedSeats.length * 12}</p>
            </div>
            <Button size="lg" onClick={handleBooking}>
              Confirm Booking
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Booking;
