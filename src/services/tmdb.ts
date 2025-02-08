
import axios from 'axios';

const TMDB_API_KEY = '9c52f42462d276f88fc32d0f13411270';
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Get trending/popular movies
export const getTrendingMovies = () => api.get('/trending/movie/week');

// Get movie details
export const getMovieDetails = (id: string) => api.get(`/movie/${id}`);

// Get movie videos (trailers, etc.)
export const getMovieVideos = (id: string) => api.get(`/movie/${id}/videos`);

// Search movies
export const searchMovies = (query: string) => api.get('/search/movie', {
  params: { query },
});

// Get movie reviews
export const getMovieReviews = (id: string) => api.get(`/movie/${id}/reviews`);

// Get movie genres
export const getMovieGenres = () => api.get('/genre/movie/list');

// Get movies by genre
export const getMoviesByGenre = (genreId: string) => api.get('/discover/movie', {
  params: { with_genres: genreId },
});

// Get popular movies
export const getPopularMovies = (page = 1) => api.get('/movie/popular', {
  params: { page },
});

// Get movie credits (cast & crew)
export const getMovieCredits = (id: string) => api.get(`/movie/${id}/credits`);

// Get similar movies
export const getSimilarMovies = (id: string) => api.get(`/movie/${id}/similar`);
