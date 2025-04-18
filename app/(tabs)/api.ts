const API_KEY = '5bf0b89cd249b4223ef5ab057c7ecf70';
const API_URL = 'https://api.themoviedb.org/3';

export const fetchPopularMovies = async () => {
  try {
    const response = await fetch(
      `${API_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};

export const fetchMovieDetails = async (id: number) => {
  try {
    const response = await fetch(
      `${API_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

export const searchMovies = async (query: string) => {
  try {
    const response = await fetch(
      `${API_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};