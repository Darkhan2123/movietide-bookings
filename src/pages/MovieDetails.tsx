import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMovieDetails, getMovieVideos } from '@/services/tmdb';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: movieData, isLoading: isLoadingMovie } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieDetails(id!),
  });

  const { data: videosData } = useQuery({
    queryKey: ['movie-videos', id],
    queryFn: () => getMovieVideos(id!),
  });

  if (isLoadingMovie) {
    return <div className="p-8">Loading...</div>;
  }

  const movie = movieData?.data;
  const trailer = videosData?.data.results.find((v: any) => v.type === 'Trailer');

  return (
    <div className="min-h-screen">
      <div 
        className="h-[50vh] relative bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute bottom-0 p-8">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          <p className="text-lg text-gray-300 mb-4">{format(new Date(movie.release_date), 'MMMM d, yyyy')}</p>
          <Button 
            variant="default" 
            size="lg"
            onClick={() => navigate(`/booking/${id}`)}
          >
            Book Tickets
          </Button>
        </div>
      </div>
      
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-300 mb-8">{movie.overview}</p>
        
        {trailer && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Trailer</h2>
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Movie Trailer"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;