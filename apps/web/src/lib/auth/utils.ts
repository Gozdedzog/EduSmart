import { UserRole } from './types';

export function getUserRole(userEmail: string): UserRole {
  const adminEmails =
    process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
  return adminEmails.includes(userEmail) ? 'admin' : 'student';
}

export function isAdminRole(role: UserRole | null): boolean {
  return role === 'admin';
}

export function canAccessAdmin(role: UserRole | null | string): boolean {
  return role === 'admin';
}
