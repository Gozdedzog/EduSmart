import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const makeUrl = (path: string) => new URL(path, request.url);

  // If auth is not configured, treat as not logged in
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(makeUrl('/auth/login?next=%2Fdashboard'));
  }

  const store = await cookies();
  const sb = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          store.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await sb.auth.getUser();

  if (user) {
    return NextResponse.redirect(makeUrl('/icerikler'));
  }

  return NextResponse.redirect(makeUrl('/auth/login?next=%2Ficerikler'));
} 