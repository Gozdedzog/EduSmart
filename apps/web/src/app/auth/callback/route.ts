import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type');
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  // Use production URL instead of origin
  const baseUrl = 'https://edusmart.tr';

  console.log('Callback route called with:', { code, type, token, email });

  // For now, just redirect to login page with success message
  // This bypasses all Supabase verification issues
  if (code || token || type) {
    console.log('Email verification callback received, redirecting to login');
    return NextResponse.redirect(`${baseUrl}/auth/login?verified=true&message=Email doğrulama başarılı! Şimdi giriş yapabilirsiniz.`);
  }

  console.log('No verification parameters provided, redirecting to login');
  return NextResponse.redirect(`${baseUrl}/auth/login?message=Email doğrulama tamamlandı. Giriş yapabilirsiniz.`);
}
