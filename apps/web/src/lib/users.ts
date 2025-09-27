// Basit kullanıcı veritabanı (Supabase olmadan)
export interface SimpleUser {
  id: string;
  email: string;
  role: 'admin' | 'student';
  fullName: string;
  createdAt: string;
}

// Manuel kullanıcılar (internal storage)
interface InternalUser extends SimpleUser {
  password: string;
}

const users: InternalUser[] = [
  {
    id: '1',
    email: 'admin@test.com',
    password: 'admin123', // Gerçek uygulamada hash'lenmiş olmalı
    role: 'admin',
    fullName: 'Admin User',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'student@test.com',
    password: 'student123',
    role: 'student',
    fullName: 'Student User',
    createdAt: new Date().toISOString(),
  }
];

export function findUserByEmail(email: string): SimpleUser | null {
  const user = users.find(user => user.email === email);
  if (user) {
    // Password'ü çıkararak döndür
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as SimpleUser;
  }
  return null;
}

export function findUserById(id: string): SimpleUser | null {
  const user = users.find(user => user.id === id);
  if (user) {
    // Password'ü çıkararak döndür
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as SimpleUser;
  }
  return null;
}

export function validateUser(email: string, password: string): SimpleUser | null {
  const user = users.find(user => user.email === email);
  if (user && user.password === password) {
    // Password'ü çıkararak döndür
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as SimpleUser;
  }
  return null;
}

export function getAllUsers(): SimpleUser[] {
  return users;
}
