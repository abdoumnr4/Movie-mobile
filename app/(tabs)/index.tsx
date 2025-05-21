import { useState, useEffect } from 'react';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Filter } from 'lucide-react-native';
import { fetchPopularMovies, searchMovies } from './api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

type FilterType = 'all' | 'movies' | 'series';
type GenreType = 'all' | 'action' | 'drama' | 'sci-fi';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  media_type: string;
  genre_ids: number[];
}

// Genre IDs mapping (based on TMDB genre IDs)
const GENRE_MAP = {
  action: 28,
  drama: 18,
  'sci-fi': 878,
};

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedGenre, setSelectedGenre] = useState<GenreType>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      try {
        const popularMovies = await fetchPopularMovies();
        setMovies(popularMovies);
        setFilteredMovies(popularMovies);
      } catch (error) {
        console.error('Failed to load movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, []);

  // Combined filtering effect
  useEffect(() => {
    let filtered = [...movies];

    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(movie =>
        selectedFilter === 'movies' ? movie.media_type === 'movie' : movie.media_type === 'tv'
      );
    }

    // Apply genre filter
    if (selectedGenre !== 'all') {
      const genreId = GENRE_MAP[selectedGenre];
      filtered = filtered.filter(movie =>
        movie.genre_ids.includes(genreId)
      );
    }

    setFilteredMovies(filtered);
  }, [searchQuery, selectedFilter, selectedGenre, movies]);

  // Search effect with debouncing
  useEffect(() => {
    if (searchQuery.trim() === '') {
      return;
    }

    const search = async () => {
      setIsLoading(true);
      try {
        const results = await searchMovies(searchQuery);
        setMovies(results);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const debounceTimer = setTimeout(() => {
      search();
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleCardPress = (id: number) => {
    router.push(`/(tabs)/${id}`);
  };

  const getPosterUrl = (path: string | null) => {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : 'https://via.placeholder.com/500x750?text=No+Poster';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search color="#999" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}>
          <Filter color="#E50914" size={24} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterChip, selectedGenre === 'all' && styles.activeChip]}
              onPress={() => setSelectedGenre('all')}>
              <Text style={[styles.filterText, selectedGenre === 'all' && styles.activeFilterText]}>
                All Genres
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedGenre === 'action' && styles.activeChip]}
              onPress={() => setSelectedGenre('action')}>
              <Text style={[styles.filterText, selectedGenre === 'action' && styles.activeFilterText]}>
                Action
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedGenre === 'drama' && styles.activeChip]}
              onPress={() => setSelectedGenre('drama')}>
              <Text style={[styles.filterText, selectedGenre === 'drama' && styles.activeFilterText]}>
                Drama
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedGenre === 'sci-fi' && styles.activeChip]}
              onPress={() => setSelectedGenre('sci-fi')}>
              <Text style={[styles.filterText, selectedGenre === 'sci-fi' && styles.activeFilterText]}>
                Sci-Fi
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator size="large" color="#E50914" style={styles.loader} />
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {filteredMovies.map((movie) => (
              <TouchableOpacity 
                key={movie.id} 
                style={styles.card}
                onPress={() => handleCardPress(movie.id)}
              >
                <Image 
                  source={{ uri: getPosterUrl(movie.poster_path) }} 
                  style={styles.poster} 
                />
                <View style={styles.cardContent}>
                  <Text style={styles.title} numberOfLines={1}>
                    {movie.title}
                  </Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.type}>{movie.media_type === 'tv' ? 'Series' : 'Movie'}</Text>
                    <Text style={styles.rating}>★ {movie.vote_average.toFixed(1)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    backgroundColor: '#eaeaea',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  filterButton: {
    padding: 8,
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  filterScroll: {
    marginBottom: 8,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#eaeaea',
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: '#E50914',
  },
  filterText: {
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
  },
  loader: {
    marginTop: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  poster: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  type: {
    fontSize: 12,
    color: '#999',
  },
  rating: {
    fontSize: 12,
    color: '#E50914',
  },
});