'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRedirectPathByRole } from '@/utils/auth-redirect.util';
import { useAuth } from '@/hooks/use-auth';

interface AuthGuardProps {
    children: ReactNode;
    redirectAuthenticated?: boolean;
}

/**
 * AuthGuard - Redirects authenticated users away from auth pages
 * Using on login/register pages
 */
export function AuthGuard({
    children,
    redirectAuthenticated = true,
}: AuthGuardProps) {
    const { isAuthenticated, isLoading, role } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated && redirectAuthenticated) {
            const redirectPath = getRedirectPathByRole(role);
            router.push(redirectPath);
        }
    }, [isAuthenticated, isLoading, role, router, redirectAuthenticated]);

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div>Loading...</div>
            </div>
        );
    }

    // If authenticated and should redirect, show loading while redirecting
    if (isAuthenticated && redirectAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div>Redirecting...</div>
            </div>
        );
    }

    return <>{children}</>;
}
