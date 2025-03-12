
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

interface SeatMapProps {
  onSeatSelect: (seats: string[]) => void;
  movieId: string;
  showtime: string;
}

const SeatMap = ({ onSeatSelect, movieId, showtime }: SeatMapProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [takenSeats, setTakenSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsPerRow = 8;

  useEffect(() => {
    // Fetch taken seats from Django backend
    const fetchTakenSeats = async () => {
      setLoading(true);
      try {
        const response = await api.get('/seats/taken/', {
          params: { movie_id: movieId, showtime }
        });
        setTakenSeats(response.data.taken_seats || []);
      } catch (error) {
        console.error('Error fetching taken seats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTakenSeats();

    // Setup polling for seat updates (as replacement for real-time Supabase)
    const intervalId = setInterval(fetchTakenSeats, 10000); // Poll every 10 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [movieId, showtime]);

  const handleSeatClick = (seatId: string) => {
    if (takenSeats.includes(seatId)) return;

    setSelectedSeats(prev => {
      const newSeats = prev.includes(seatId)
        ? prev.filter(s => s !== seatId)
        : [...prev, seatId];
      onSeatSelect(newSeats);
      return newSeats;
    });
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="w-full max-w-2xl bg-muted/30 p-8 rounded-lg">
        <div className="w-full h-4 bg-primary/20 rounded mb-12 text-center text-sm">Screen</div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading seats...</p>
          </div>
        ) : (
          rows.map(row => (
            <div key={row} className="flex justify-center mb-2">
              <span className="w-6 text-center">{row}</span>
              {[...Array(seatsPerRow)].map((_, index) => {
                const seatId = `${row}${index + 1}`;
                return (
                  <button
                    key={seatId}
                    className={cn(
                      'seat',
                      takenSeats.includes(seatId)
                        ? 'seat-taken'
                        : selectedSeats.includes(seatId)
                        ? 'seat-selected'
                        : 'seat-available'
                    )}
                    onClick={() => handleSeatClick(seatId)}
                    disabled={takenSeats.includes(seatId)}
                  >
                    <span className="sr-only">Seat {seatId}</span>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-accent rounded" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-muted rounded" />
          <span>Taken</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
