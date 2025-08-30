import { UserRole } from '@/types/auth.types';

/**
 * Get the appropriate redirect path based on user role
 */
export function getRedirectPathByRole(role: UserRole): string {
    switch (role) {
        case 'admin':
            return '/admin';
        case 'manager':
            return '/'; 
        case 'user':
        default:
            return '/';
    }
}

/**
 * Get the default dashboard path for a role
 */
export function getDashboardPath(role: UserRole): string {
    switch (role) {
        case 'admin':
            return '/admin';
        case 'manager':
            return '/'; 
        case 'user':
        default:
            return '/';
    }
}
