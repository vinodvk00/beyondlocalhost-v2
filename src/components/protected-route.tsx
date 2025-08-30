'use client';

import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useRole } from '@/hooks/use-role';
import { UserRole } from '@/types/auth.types';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: UserRole;
    redirectTo?: string;
}

export function ProtectedRoute({
    children,
    requiredRole,
    redirectTo = '/login',
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const { hasRole } = useRole();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div>Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        if (typeof window !== 'undefined') {
            window.location.href = redirectTo;
        }
        return null;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500">
                        Unauthorized
                    </h1>
                    <p>You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
