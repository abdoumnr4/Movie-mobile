import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Configuration de l'API
const API_BASE_URL = 'http://localhost:3000/api'; // À modifier selon votre configuration

// Utilisateurs de test
const TEST_USERS = [
  { email: 'admin@example.com', password: 'Admin123!', role: 'admin' },
  { email: 'user@example.com', password: 'User123!', role: 'user' },
  { email: 'test@example.com', password: 'Test123!', role: 'user' }
];

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  sessionTimeout: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Durée de session en millisecondes (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;
const TOKEN_KEY = 'auth_token';
const LAST_ACTIVITY_KEY = 'last_activity';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(SESSION_TIMEOUT);

  // Vérifier la session au démarrage
  useEffect(() => {
    checkSession();
    const interval = setInterval(checkSession, 60000); // Vérifier toutes les minutes
    return () => clearInterval(interval);
  }, []);

  const checkSession = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const lastActivity = await AsyncStorage.getItem(LAST_ACTIVITY_KEY);
      
      if (!token || !lastActivity) {
        setIsAuthenticated(false);
        return;
      }

      const lastActivityTime = parseInt(lastActivity);
      const currentTime = Date.now();
      
      if (currentTime - lastActivityTime > sessionTimeout) {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(LAST_ACTIVITY_KEY);
        setIsAuthenticated(false);
        return;
      }

      // Mettre à jour le timestamp de dernière activité
      await updateLastActivity();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erreur lors de la vérification de la session:', error);
      setIsAuthenticated(false);
    }
  };

  const updateLastActivity = async () => {
    await AsyncStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  };

  const login = async (email: string, password: string) => {
    try {
      // Vérification des identifiants de test
      const user = TEST_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        throw new Error('Échec de l\'authentification');
      }

      // Simuler un token
      const token = `test-token-${Date.now()}`;
      
      // Stocker le token
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await updateLastActivity();
      
      setIsAuthenticated(true);
      router.push('/(tabs)');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, sessionTimeout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}; 