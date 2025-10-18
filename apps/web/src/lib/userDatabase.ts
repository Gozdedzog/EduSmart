// JSON dosya tabanlı kullanıcı veritabanı
export interface LocalUser {
  id: string;
  email: string;
  password: string; // Hash'lenmiş olacak
  firstName: string;
  lastName: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  role: 'admin' | 'student';
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

const STORAGE_KEY = 'smart_learn_users';

// Varsayılan kullanıcılar (doğrulanmış olarak işaretlenmiş)
function getDefaultUsers(): LocalUser[] {
  return [
    {
      id: '1',
      email: 'admin@test.com',
      password: 'admin123', // Gerçek uygulamada hash'lenmiş olmalı
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'student@test.com',
      password: 'student123',
      firstName: 'Student',
      lastName: 'User',
      role: 'student',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];
}

// JSON dosyasından kullanıcıları yükle
async function loadUsersFromFile(): Promise<LocalUser[]> {
  try {
    const response = await fetch('/api/users');
    const data = await response.json();
    return data.kullanicilar || [];
  } catch (error) {
    console.error('Error loading users from file:', error);
    return getDefaultUsers();
  }
}

// LocalStorage'dan kullanıcıları yükle (fallback)
function loadUsersFromStorage(): LocalUser[] {
  if (typeof window === 'undefined') {
    return getDefaultUsers();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const users = JSON.parse(stored);
      console.log('Loaded users from storage:', users.length);
      return users;
    } else {
      // Storage'da veri yoksa varsayılan kullanıcıları yükle
      console.log('No users in storage, loading default users');
      const defaultUsers = getDefaultUsers();
      saveUsersToStorage(defaultUsers);
      return defaultUsers;
    }
  } catch (error) {
    console.error('Error loading users from storage:', error);
    return getDefaultUsers();
  }
}

// JSON dosyasına kullanıcıları kaydet
async function saveUsersToFile(users: LocalUser[]): Promise<boolean> {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ kullanicilar: users }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error saving users to file:', error);
    return false;
  }
}

// LocalStorage'a kullanıcıları kaydet
function saveUsersToStorage(users: LocalUser[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    console.log('Users saved to storage:', users.length);
  } catch (error) {
    console.error('Error saving users to storage:', error);
  }
}

// Tüm kullanıcıları getir
export async function getAllUsers(): Promise<LocalUser[]> {
  try {
    // Önce JSON dosyasından yüklemeyi dene
    const users = await loadUsersFromFile();
    if (users.length > 0) {
      return users;
    }
  } catch (error) {
    console.error('Error loading users from file, falling back to storage:', error);
  }
  
  // Fallback: localStorage'dan yükle
  return loadUsersFromStorage();
}

// Email ile kullanıcı bul
export function findUserByEmail(email: string): LocalUser | null {
  const users = loadUsersFromStorage();
  return users.find(user => user.email === email) || null;
}

// ID ile kullanıcı bul
export function findUserById(id: string): LocalUser | null {
  const users = loadUsersFromStorage();
  return users.find(user => user.id === id) || null;
}

// Kullanıcı doğrulama (email + password)
export function validateUser(email: string, password: string): LocalUser | null {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
}

// Yeni kullanıcı ekle
export async function addUser(userData: Omit<LocalUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<LocalUser> {
  const users = await getAllUsers();
  const newUser: LocalUser = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  
  // JSON dosyasına kaydet
  const success = await saveUsersToFile(users);
  if (success) {
    console.log('User added to file:', newUser.email);
  } else {
    // Fallback: localStorage'a kaydet
    saveUsersToStorage(users);
    console.log('User added to storage:', newUser.email);
  }
  
  return newUser;
}

// Kullanıcı güncelle
export async function updateUser(id: string, userData: Partial<LocalUser>): Promise<LocalUser | null> {
  const users = await getAllUsers();
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return null;
  }
  
  users[userIndex] = {
    ...users[userIndex],
    ...userData,
    updatedAt: new Date().toISOString(),
  };
  
  // JSON dosyasına kaydet
  const success = await saveUsersToFile(users);
  if (success) {
    console.log('User updated in file:', users[userIndex].email);
  } else {
    // Fallback: localStorage'a kaydet
    saveUsersToStorage(users);
    console.log('User updated in storage:', users[userIndex].email);
  }
  
  return users[userIndex];
}

// Kullanıcı sil
export async function deleteUser(id: string): Promise<boolean> {
  const users = await getAllUsers();
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return false;
  }
  
  users.splice(userIndex, 1);
  
  // JSON dosyasına kaydet
  const success = await saveUsersToFile(users);
  if (success) {
    console.log('User deleted from file:', id);
  } else {
    // Fallback: localStorage'a kaydet
    saveUsersToStorage(users);
    console.log('User deleted from storage:', id);
  }
  
  return true;
}

// Email doğrulama durumunu güncelle
export async function verifyUserEmail(id: string): Promise<LocalUser | null> {
  return await updateUser(id, { isEmailVerified: true });
}

// Son giriş zamanını güncelle
export async function updateLastLogin(id: string): Promise<LocalUser | null> {
  return await updateUser(id, { lastLogin: new Date().toISOString() });
}

// Password'ü hash'le (basit hash - gerçek uygulamada bcrypt kullanın)
export function hashPassword(password: string): string {
  // Bu basit bir hash örneği - gerçek uygulamada bcrypt kullanın
  return btoa(password + 'salt');
}

// Hash'lenmiş password'ü doğrula
export function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}
