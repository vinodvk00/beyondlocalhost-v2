import { UserRole, hasRoleAccess } from '@/types/auth.types';
import { useAuth } from './use-auth';

export function useRole() {
    const { role, isAuthenticated } = useAuth();

    const hasRole = (requiredRole: UserRole): boolean => {
        if (!isAuthenticated) return false;
        return hasRoleAccess(role, requiredRole);
    };

    const isAdmin = (): boolean => role === 'admin';
    const isManager = (): boolean => hasRole('manager');
    const isUser = (): boolean => role === 'user';

    return {
        hasRole,
        isAdmin,
        isManager,
        isUser,
        currentRole: role,
    };
}
