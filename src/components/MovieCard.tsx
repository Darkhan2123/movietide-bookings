import { Link } from 'react-router-dom';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  releaseDate: string;
}

const MovieCard = ({ id, title, posterPath, releaseDate }: MovieCardProps) => {
  const imageUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
  
  return (
    <Link to={`/movie/${id}`} className="movie-card">
      <img 
        src={posterPath ? imageUrl : '/placeholder.svg'} 
        alt={title}
        className="h-[300px] w-full object-cover"
      />
      <div className="movie-card-overlay">
        <div className="absolute bottom-0 p-4 w-full">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-gray-300">{releaseDate}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;