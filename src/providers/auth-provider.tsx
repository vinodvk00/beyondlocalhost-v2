'use client';

import { ReactNode, createContext, useContext } from 'react';
import { useSession } from '@/lib/auth-client';
import { ExtendedUser, UserRole } from '@/types/auth.types';

interface AuthContextType {
    user: ExtendedUser | null;
    role: UserRole;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: any;
    refetch: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { data: session, isPending, error, refetch } = useSession();

    const user = session?.user as ExtendedUser | undefined;

    const value: AuthContextType = {
        user: user ? { ...user, role: user.role || 'user' } : null,
        role: user?.role || 'user',
        isAuthenticated: !!user,
        isLoading: isPending,
        error,
        refetch,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
