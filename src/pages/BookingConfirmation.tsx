
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { sendBookingConfirmation } from '@/services/EmailService';
import { toast } from 'sonner';

interface BookingDetails {
  movieTitle: string;
  showtime: string;
  seats: string[];
  amount: number;
}

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const booking = location.state as BookingDetails;

  if (!booking) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">No booking information found</h1>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  const showtime = new Date(booking.showtime);

  const handleSendEmail = async () => {
    if (!user?.email) {
      toast.error('No email address found');
      return;
    }

    try {
      await sendBookingConfirmation(user.email, booking);
      toast.success('Booking confirmation sent to your email');
    } catch (error) {
      toast.error('Failed to send confirmation email');
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
          <div className="text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Movie</h2>
            <p className="text-xl">{booking.movieTitle}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Showtime</h2>
            <p className="text-xl">{format(showtime, 'PPP')}</p>
            <p className="text-xl">{format(showtime, 'p')}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Seats</h2>
            <p className="text-xl">{booking.seats.join(', ')}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Total Amount</h2>
            <p className="text-xl">${booking.amount.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <Button 
            className="w-full" 
            variant="default"
            onClick={handleSendEmail}
          >
            Send Confirmation Email
          </Button>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
