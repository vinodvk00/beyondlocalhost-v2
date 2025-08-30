import type { UserRole } from './auth.types';

// Extend Better Auth's User type to include our custom fields
declare module 'better-auth' {
  interface User {
    role?: UserRole;
  }
}

// This ensures TypeScript knows about the role field in session data