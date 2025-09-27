# Authentication Setup

## AuthProvider Wrapper

The AuthProvider wrapper is required for the authentication system to work properly. It must wrap the entire app at the root level.

### Example Usage

```tsx
// In app/layout.tsx (App Router)
import { AuthProvider } from '@/context/AuthProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

### Using useAuth Hook

```tsx
import { useAuth } from '@/context/AuthProvider';

function MyComponent() {
  const { user, loading, login, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>{user ? <p>Welcome, {user.email}!</p> : <p>Please log in</p>}</div>
  );
}
```

### Error Prevention

The useAuth hook is designed to be safe and will not crash the app if used outside of an AuthProvider. Instead, it returns safe default values:

- `user: null`
- `loading: true`
- All auth functions return error messages

This ensures the app continues to work even if the AuthProvider is missing or misconfigured.

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_EMAILS=admin@example.com,admin2@example.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Auth Flows

- **Signup**: `/auth/signup` - Email/password registration
- **Login**: `/auth/login` - Email/password authentication with redirect support
- **Reset**: `/auth/reset` - Password reset via email
- **Admin**: `/admin` - Admin-only panel (requires admin email in ADMIN_EMAILS)

## Guards

- **RequireAuth**: Protects routes requiring authentication
- **RequireAdmin**: Protects admin-only routes

## Supabase Configuration

If Supabase environment variables are missing, the app will:

- Show helpful error messages in auth forms
- Disable admin features gracefully
- Continue to work without authentication
- Log warnings to console
