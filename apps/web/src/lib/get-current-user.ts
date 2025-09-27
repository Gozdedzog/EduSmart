'use server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function getCurrentUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Return null if environment variables are missing
    return null;
  }

  try {
    const store = await cookies();
    const sb = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return store.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              store.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    });
    const { data } = await sb.auth.getUser();
    if (!data?.user) return null;
    const m = data.user.user_metadata ?? {};
    const fullName = m.full_name || m.name || m.fullName;
    const email = data.user.email;
    return fullName || (email ? email.split('@')[0] : null);
  } catch (error) {
    // Return null if there's any error with Supabase
    console.warn('Error getting current user:', error);
    return null;
  }
}
