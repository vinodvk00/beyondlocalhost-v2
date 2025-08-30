import { useAuthContext } from '@/providers/auth-provider';

export function useAuth() {
    const { user, role, isAuthenticated, isLoading, error, refetch } =
        useAuthContext();

    return {
        user,
        role,
        isAuthenticated,
        isLoading,
        error,
        refetch,
    };
}
