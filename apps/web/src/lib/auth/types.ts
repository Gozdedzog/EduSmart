export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  last_login?: string;
  isEmailVerified?: boolean;
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: 'male' | 'female';
  user_metadata?: { 
    [key: string]: any;
    age?: number;
    gender?: 'male' | 'female';
  };
}

export interface AuthState {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
}

export interface AuthContextType extends AuthState {
  signup:
    (email: string, password: string, firstName?: string, lastName?: string, age?: number, gender?: 'male' | 'female' | 'other') =>
    Promise<{ error?: string }>;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  sendReset: (email: string) => Promise<{ error?: string }>;
  refreshUser: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ error?: string }>;
}
