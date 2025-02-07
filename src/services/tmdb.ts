import axios from 'axios';

const TMDB_API_KEY = '9c52f42462d276f88fc32d0f13411270';
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getTrendingMovies = () => api.get('/trending/movie/week');
export const getMovieDetails = (id: string) => api.get(`/movie/${id}`);
export const getMovieVideos = (id: string) => api.get(`/movie/${id}/videos`);
export const searchMovies = (query: string) => api.get('/search/movie', {
  params: { query },
});