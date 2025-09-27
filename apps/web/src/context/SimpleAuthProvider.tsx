'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { SimpleUser, validateUser, findUserById } from '@/lib/users';
import { UserRole } from '@/lib/auth/types';

interface SimpleAuthContextType {
  user: SimpleUser | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ user?: SimpleUser; error?: string }>;
  logout: () => void;
  refreshUser: () => void;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const foundUser = findUserById(userId);
      if (foundUser) {
        setUser(foundUser);
      } else {
        localStorage.removeItem('userId');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const foundUser = validateUser(email, password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('userId', foundUser.id);
      return { user: foundUser };
    } else {
      return { error: 'Geçersiz e-posta veya şifre' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
  };

  const value: SimpleAuthContextType = {
    user,
    role: (user?.role as UserRole) || null,
    loading,
    login,
    logout,
    refreshUser,
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
}

export function useSimpleAuth() {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
}
