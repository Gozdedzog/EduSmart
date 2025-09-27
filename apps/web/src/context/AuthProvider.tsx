'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthContextType, User, UserRole } from '@/lib/auth/types';
import { getUserRole } from '@/lib/auth/utils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Check if Supabase is properly configured
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !==
      'https://placeholder.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-anon-key';

  const refreshUser = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Error getting user:', error);
        setUser(null);
        setRole(null);
        return;
      }

      if (authUser) {
        const userRole = getUserRole(authUser.email!);
        const userData: User = {
          id: authUser.id,
          email: authUser.email!,
          role: userRole,
          created_at: authUser.created_at,
          last_login: authUser.last_sign_in_at || undefined,
          user_metadata: authUser.user_metadata,
        };
        setUser(userData);
        setRole(userRole);
      } else {
        setUser(null);
        setRole(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, [isSupabaseConfigured, supabase]);

  useEffect(() => {
    refreshUser();

    if (!isSupabaseConfigured) {
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async event => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await refreshUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshUser, isSupabaseConfigured, supabase]);

  const signup = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    age?: number,
    gender?: 'male' | 'female' | 'other'
  ) => {
    if (!isSupabaseConfigured) {
      return {
        error:
          'Authentication is not configured. Please contact the administrator.',
      };
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
          data: {
            full_name: `${firstName || ''} ${lastName || ''}`.trim(),
            age: age,
            gender: gender,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  };

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return {
        error:
          'Authentication is not configured. Please contact the administrator.',
      };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setRole(null);
      return;
    }

    try {
      await supabase.auth.signOut();
    } catch {
      console.error('Error logging out');
    }
  };

  const sendReset = async (email: string) => {
    if (!isSupabaseConfigured) {
      return {
        error:
          'Authentication is not configured. Please contact the administrator.',
      };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset`,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!isSupabaseConfigured) {
      return {
        error:
          'Authentication is not configured. Please contact the administrator.',
      };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  };

  const value: AuthContextType = {
    user,
    role,
    loading,
    signup,
    login,
    logout,
    sendReset,
    refreshUser,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return safe defaults instead of throwing to prevent crashes
    return {
      user: null,
      role: null,
      loading: true,
      signup: async () => (
        { error: 'AuthProvider not found' }
      ),
      login: async () => ({ error: 'AuthProvider not found' }),
      logout: async () => {},
      sendReset: async () => ({ error: 'AuthProvider not found' }),
      refreshUser: async () => {},
      updatePassword: async () => ({ error: 'AuthProvider not found' }),
    };
  }
  return context;
}
