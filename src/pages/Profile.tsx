
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { QRCodeSVG } from 'qrcode.react';

interface Ticket {
  id: string;
  movie_title: string;
  showtime: string;
  seats: string[];
  created_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets/');
        setTickets(response.data || []);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTickets();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Tickets</h1>
      {tickets.length === 0 ? (
        <p className="text-muted-foreground">No tickets found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{ticket.movie_title}</h3>
                  <p className="text-muted-foreground">
                    {new Date(ticket.showtime).toLocaleString()}
                  </p>
                  <p>Seats: {ticket.seats.join(', ')}</p>
                  <p className="text-green-500 mt-2">✓ Paid</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <QRCodeSVG
                    value={JSON.stringify({
                      ticketId: ticket.id,
                      movieTitle: ticket.movie_title,
                      showtime: ticket.showtime,
                      seats: ticket.seats,
                      paid: true
                    })}
                    size={100}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
