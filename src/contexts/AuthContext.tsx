
import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';

type User = {
  id: string;
  email: string;
  username?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (via token)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await api.get('/auth/user/');
          setUser(response.data);
        } catch (error) {
          // If token is invalid, clear it
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await api.post('/auth/login/', { email, password });
    localStorage.setItem('auth_token', response.data.token);
    setUser(response.data.user);
  };

  const signUp = async (email: string, password: string) => {
    const response = await api.post('/auth/register/', { email, password });
    localStorage.setItem('auth_token', response.data.token);
    setUser(response.data.user);
  };

  const signOut = async () => {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
