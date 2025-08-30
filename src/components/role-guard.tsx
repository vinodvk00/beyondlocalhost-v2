import { ReactNode } from 'react';
import { useRole } from '@/hooks/use-role';
import { UserRole } from '@/types/auth.types';

interface RoleGuardProps {
    requiredRole: UserRole;
    fallback?: ReactNode;
    children: ReactNode;
}

export function RoleGuard({
    requiredRole,
    fallback = <div className="text-red-500">Access Denied</div>,
    children,
}: RoleGuardProps) {
    const { hasRole } = useRole();

    if (!hasRole(requiredRole)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
