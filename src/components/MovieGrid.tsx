import { useQuery } from '@tanstack/react-query';
import { getTrendingMovies } from '../services/tmdb';
import MovieCard from './MovieCard';
import { Skeleton } from './ui/skeleton';

const MovieGrid = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['trending-movies'],
    queryFn: getTrendingMovies,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-[300px] w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {data?.data.results.map((movie: any) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          posterPath={movie.poster_path}
          releaseDate={movie.release_date}
        />
      ))}
    </div>
  );
};

export default MovieGrid;