import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from './src/lib/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const makeUrl = (path: string) => new URL(path, request.url);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isSupabaseConfigured =
    !!supabaseUrl &&
    !!supabaseKey &&
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    supabaseKey !== 'placeholder-anon-key';

  const protectedPaths = ['/dashboard', '/icerikler'];
  const isProtected = protectedPaths.some(p => pathname.startsWith(p));

  // Eğer Supabase yapılandırılmamışsa, yine de kritik rotaları koru
  if (!isSupabaseConfigured) {
    if (isProtected) {
      return NextResponse.redirect(makeUrl(`/auth/login?next=${encodeURIComponent(pathname)}`));
    }
    // Korumasız rotalar için veya oturum yenilemeye ihtiyaç duyuluyorsa, updateSession çağır
    return await updateSession(request);
  }

  // Eğer Supabase yapılandırılmışsa, korumalı rotalar için kullanıcıyı açıkça kontrol et
  if (isProtected) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(makeUrl(`/auth/login?next=${encodeURIComponent(pathname)}`));
    }
  }

  // Tüm rotalar için oturumu taze tutmak üzere updateSession'ı her zaman çağır
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
