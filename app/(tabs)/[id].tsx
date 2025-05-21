import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Clock, Star, Calendar } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { fetchMovieDetails } from './api';

const { width } = Dimensions.get('window');

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }
  
  interface CrewMember {
    id: number;
    name: string;
    job: string;
  }
  
  interface MovieDetails {
    id: number;
    title: string;
    overview: string;
    backdrop_path: string | null;
    poster_path: string | null;
    vote_average: number;
    release_date: string;
    runtime: number | null;
    genres: Array<{
      id: number;
      name: string;
    }>;
    credits: {
      cast: CastMember[];
      crew: CrewMember[];
    };
  }
  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        const details = await fetchMovieDetails(Number(id));
        setMovie(details);
      } catch (error) {
        console.error('Failed to load movie details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovieDetails();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Movie not found</Text>
      </View>
    );
  }

  const getBackdropUrl = (path: string | null) => {
      return path ? `https://image.tmdb.org/t/p/w1280${path}` : 'https://via.placeholder.com/1280x720?text=No+Backdrop';
    };

  const getDirector = () => {
    if (!movie.credits || !movie.credits.crew) return null;
    return movie.credits.crew.find(person => person.job === 'Director');
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.header}>
        <Image source={{ uri: getBackdropUrl(movie.backdrop_path) }} style={styles.backdrop} />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <View style={styles.overlay} />
        <View style={styles.headerContent}>
          <Text style={styles.title}>{movie.title}</Text>
          <View style={styles.metadata}>
            <View style={styles.metaItem}>
              <Star color="#E50914" size={16} />
              <Text style={styles.metaText}>{movie.vote_average.toFixed(1)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Calendar color="#E50914" size={16} />
              <Text style={styles.metaText}>{new Date(movie.release_date).getFullYear()}</Text>
            </View>
            {movie.runtime && (
              <View style={styles.metaItem}>
                <Clock color="#E50914" size={16} />
                <Text style={styles.metaText}>{formatRuntime(movie.runtime)}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.description}>{movie.overview || 'No overview available.'}</Text>
        </View>

        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {movie.credits.cast.slice(0, 10).map((actor) => (
                <View key={actor.id} style={styles.castItem}>
                  <Image 
                    source={{ uri: actor.profile_path 
                      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                      : 'https://via.placeholder.com/200x200?text=No+Image'
                    }} 
                    style={styles.castAvatar} 
                  />
                  <Text style={styles.castName}>{actor.name}</Text>
                  <Text style={styles.characterName}>{actor.character}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {getDirector() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Director</Text>
            {getDirector() && <Text style={styles.directorName}>{getDirector()?.name}</Text>}
          </View>
        )}

        {movie.genres && movie.genres.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Genres</Text>
            <View style={styles.genresContainer}>
              {movie.genres.map(genre => (
                <View key={genre.id} style={styles.genrePill}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  header: {
    height: width * 0.8,
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#fff',
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    color: '#999',
    fontSize: 16,
    lineHeight: 24,
  },
  castItem: {
    alignItems: 'center',
    width: 100,
    marginRight: 16,
  },
  castAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    marginBottom: 8,
  },
  castName: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  characterName: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
  directorName: {
    color: '#999',
    fontSize: 16,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genrePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E50914',
    borderRadius: 16,
  },
  genreText: {
    color: '#fff',
    fontSize: 14,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});