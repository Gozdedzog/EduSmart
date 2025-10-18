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
import { 
  findUserByEmail as findLocalUserByEmail, 
  findUserById as findLocalUserById,
  validateUser as validateLocalUser,
  addUser as addLocalUser,
  updateLastLogin as updateLocalLastLogin,
  LocalUser
} from '@/lib/userDatabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function HybridAuthProvider({ children }: { children: React.ReactNode }) {
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

  // Local user'ı User interface'ine dönüştür
  const convertLocalUserToUser = (localUser: LocalUser): User => {
    return {
      id: localUser.id,
      email: localUser.email,
      role: localUser.role,
      created_at: localUser.createdAt,
      last_login: localUser.lastLogin,
      isEmailVerified: localUser.isEmailVerified,
      firstName: localUser.firstName,
      lastName: localUser.lastName,
      age: localUser.age,
      gender: localUser.gender,
      user_metadata: {
        age: localUser.age,
        gender: localUser.gender,
        full_name: `${localUser.firstName} ${localUser.lastName}`.trim(),
      },
    };
  };

  const refreshUser = useCallback(async () => {
    console.log('refreshUser called');
    // Önce local storage'dan kontrol et
    const userId = localStorage.getItem('userId');
    console.log('localStorage userId:', userId);
    if (userId) {
      const localUser = findLocalUserById(userId);
      console.log('localUser found:', localUser);
      if (localUser) {
        const userData = convertLocalUserToUser(localUser);
        console.log('Setting user data:', userData);
        setUser(userData);
        setRole(userData.role);
        setLoading(false);
        console.log('Loading set to false after local user');
        return;
      } else {
        localStorage.removeItem('userId');
      }
    }

    // Local'de bulunamazsa Supabase'i kontrol et
    console.log('isSupabaseConfigured:', isSupabaseConfigured);
    if (!isSupabaseConfigured) {
      console.log('Supabase not configured, setting loading to false');
      setUser(null);
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Checking Supabase auth...');
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser();

      console.log('Supabase auth result:', { authUser, error });

      if (error) {
        console.error('Error getting user from Supabase:', error);
        setUser(null);
        setRole(null);
        setLoading(false);
        console.log('Loading set to false after Supabase error');
        return;
      }

      if (authUser) {
        console.log('Supabase user found:', authUser);
        const userRole = getUserRole(authUser.email!);
        const userData: User = {
          id: authUser.id,
          email: authUser.email!,
          role: userRole,
          created_at: authUser.created_at,
          last_login: authUser.last_sign_in_at || undefined,
          isEmailVerified: authUser.email_confirmed_at ? true : false,
          user_metadata: authUser.user_metadata,
        };
        setUser(userData);
        setRole(userRole);
        setLoading(false);
        console.log('Supabase user data set, loading set to false');
      } else {
        console.log('No Supabase user found');
        setUser(null);
        setRole(null);
        setLoading(false);
        console.log('No Supabase user, loading set to false');
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      setRole(null);
      setLoading(false);
      console.log('Loading set to false after catch error');
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
  }, [isSupabaseConfigured, supabase]);

  const signup = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    age?: number,
    gender?: 'male' | 'female' | 'other'
  ) => {
    // Önce local'e kaydet
    try {
      const existingUser = findLocalUserByEmail(email);
      if (existingUser) {
        return { error: 'Bu e-posta adresi zaten kullanılıyor' };
      }

      const newLocalUser = addLocalUser({
        email,
        password, // Gerçek uygulamada hash'lenmeli
        firstName: firstName || '',
        lastName: lastName || '',
        age,
        gender,
        role: 'student', // Yeni kullanıcılar student olarak başlar
        isEmailVerified: true, // Local auth'da email doğrulama gerekmez
      });

      console.log('User added to local database:', (await newLocalUser).email);

      // Supabase'e de kaydet (eğer yapılandırılmışsa)
      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `https://edusmart.tr/auth/callback`,
              data: {
                full_name: `${firstName || ''} ${lastName || ''}`.trim(),
                age: age,
                gender: gender,
              },
            },
          });

          if (error) {
            console.warn('Supabase signup failed, but local signup succeeded:', error.message);
            // Local kayıt başarılı olduğu için hata döndürmüyoruz
          } else {
            console.log('User also added to Supabase');
          }
        } catch (supabaseError) {
          console.warn('Supabase signup failed, but local signup succeeded:', supabaseError);
        }
      }

      return {};
    } catch (error) {
      console.error('Error during signup:', error);
      return { error: 'Kayıt olurken bir hata oluştu' };
    }
  };

  const login = async (email: string, password: string) => {
    // Önce local'de kontrol et
    const localUser = validateLocalUser(email, password);
    if (localUser) {
      // Local'de bulundu, giriş yap
      const userData = convertLocalUserToUser(localUser);
      setUser(userData);
      setRole(userData.role);
      localStorage.setItem('userId', localUser.id);
      
      // Son giriş zamanını güncelle
      updateLocalLastLogin(localUser.id);
      
      console.log('User logged in from local database:', localUser.email);
      return {};
    }

    // Local'de bulunamazsa Supabase'i kontrol et
    if (!isSupabaseConfigured) {
      return { error: 'Geçersiz e-posta veya şifre' };
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
      return { error: 'Giriş yaparken bir hata oluştu' };
    }
  };

  const logout = async () => {
    // Local'den çıkış yap
    setUser(null);
    setRole(null);
    localStorage.removeItem('userId');

    // Supabase'den de çıkış yap (eğer yapılandırılmışsa)
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        console.error('Error logging out from Supabase');
      }
    }
  };

  const sendReset = async (email: string) => {
    if (!isSupabaseConfigured) {
      return {
        error:
          'Şifre sıfırlama özelliği şu anda kullanılamıyor. Lütfen yönetici ile iletişime geçin.',
      };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `https://edusmart.tr/auth/reset`,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch {
      return { error: 'Şifre sıfırlama e-postası gönderilirken bir hata oluştu' };
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!isSupabaseConfigured) {
      return {
        error:
          'Şifre güncelleme özelliği şu anda kullanılamıyor. Lütfen yönetici ile iletişime geçin.',
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
      return { error: 'Şifre güncellenirken bir hata oluştu' };
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
