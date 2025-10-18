import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || 
      supabaseUrl === 'https://placeholder.supabase.co' || 
      supabaseKey === 'placeholder-anon-key') {
    console.warn(
      'Supabase environment variables are missing. Auth features will be disabled.'
    );
    // Return a safe no-op client that won't crash
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-anon-key'
    );
  }

  console.log('Supabase client created with URL:', supabaseUrl);
  return createBrowserClient(supabaseUrl, supabaseKey);
}
