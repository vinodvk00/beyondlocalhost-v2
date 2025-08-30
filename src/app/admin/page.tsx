'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { RoleGuard } from '@/components/role-guard';

export default function AdminPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <div>
                <h1>Admin Dashboard</h1>

                <RoleGuard requiredRole="admin">
                    <button>Delete All Users</button>
                </RoleGuard>
            </div>
        </ProtectedRoute>
    );
}
