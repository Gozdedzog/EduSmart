'use client';

import { useState } from 'react';
import { useAuth } from '@/context/HybridAuthProvider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading, logout, updatePassword } = useAuth();
  const router = useRouter();

  // Debug logları
  console.log('ProfilePage render:', { user, loading });

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmNewPassword) {
      setPasswordError('Yeni şifreler eşleşmiyor.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setPasswordLoading(true);
    const { error } = await updatePassword(newPassword);
    if (error) {
      setPasswordError(error);
    } else {
      setPasswordSuccess('Şifreniz başarıyla güncellendi.');
      setNewPassword('');
      setConfirmNewPassword('');
    }
    setPasswordLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/'); // Çıkış yaptıktan sonra ana sayfaya yönlendir
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null; // RequireAuth zaten yönlendirme yapacak
  }

  const fullName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`.trim()
    : user.user_metadata?.full_name || user.email.split('@')[0];

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Profilim
              </CardTitle>
              <CardDescription className="text-center">
                Hesap bilgilerinizi yönetin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-2">
                <Label className="font-medium">E-posta:</Label>
                <Input type="email" value={user.email} disabled />
              </div>
              {fullName && (
                <div className="flex flex-col gap-2">
                  <Label className="font-medium">Ad Soyad:</Label>
                  <Input type="text" value={fullName} disabled />
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">Şifreyi Değiştir</h3>
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                    {passwordSuccess}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Yeni Şifre</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={passwordLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Yeni Şifre Tekrar</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    disabled={passwordLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={passwordLoading}>
                  {passwordLoading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                </Button>
              </form>

              <div className="border-t pt-4">
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full"
                  disabled={loading}
                >
                  Çıkış Yap
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAuth>
  );
} 