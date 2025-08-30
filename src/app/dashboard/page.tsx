'use client';

import { useRole } from '@/hooks/use-role';
import { RoleGuard } from '@/components/role-guard';

export default function Dashboard() {
    const { hasRole, isAdmin, currentRole } = useRole();

    return (
        <div>
            <h1>Dashboard - Welcome {currentRole}!</h1>

            {/* Show admin panel only to admins */}
            <RoleGuard requiredRole="admin">
                <div className="rounded bg-red-100 p-4">
                    <h2>Admin Panel</h2>
                    <button>Manage Users</button>
                </div>
            </RoleGuard>

            {/* Show manager features */}
            {hasRole('manager') && (
                <div className="rounded bg-blue-100 p-4">
                    <h2>Manager Tools</h2>
                    <button>View Reports</button>
                </div>
            )}

            {/* Conditional rendering */}
            {isAdmin() && <button>Super Admin Actions</button>}
        </div>
    );
}
