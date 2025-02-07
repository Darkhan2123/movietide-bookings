import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface SeatMapProps {
  onSeatSelect: (seats: string[]) => void;
  movieId: string;
  showtime: string;
}

const SeatMap = ({ onSeatSelect, movieId, showtime }: SeatMapProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [takenSeats, setTakenSeats] = useState<string[]>([]);
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsPerRow = 8;

  useEffect(() => {
    // Subscribe to real-time seat updates
    const channel = supabase
      .channel(`seats:${movieId}:${showtime}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tickets',
        filter: `movie_id=eq.${movieId} AND showtime=eq.${showtime}`,
      }, (payload) => {
        // Update taken seats when new tickets are created
        if (payload.new) {
          setTakenSeats(prev => [...prev, ...(payload.new as any).seats]);
        }
      })
      .subscribe();

    // Fetch initial taken seats
    const fetchTakenSeats = async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('seats')
        .eq('movie_id', movieId)
        .eq('showtime', showtime);

      if (!error && data) {
        const allTakenSeats = data.flatMap(ticket => ticket.seats);
        setTakenSeats(allTakenSeats);
      }
    };

    fetchTakenSeats();

    return () => {
      supabase.removeChannel(channel);
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
        {rows.map(row => (
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
        ))}
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