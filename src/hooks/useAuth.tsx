'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  const verifyToken = useCallback(async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.user);
    } catch (error) {
      // Token is invalid, clear auth data
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Initialize auth state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        verifyToken();
      } else {
        setLoading(false);
      }
    }
  }, [verifyToken]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { user, token } = response;

      setUser(user);
      setToken(token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authAPI.register(userData);
      const { user, token } = response;

      setUser(user);
      setToken(token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      throw error;
    }
  };

  // logout is defined above with useCallback

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return a safe default during prerender or when provider is not yet mounted
    return {
      user: null,
      token: null,
      login: async () => {},
      register: async () => {},
      logout: () => {},
      loading: false,
      isAuthenticated: false,
    } as const;
  }
  return context;
}
