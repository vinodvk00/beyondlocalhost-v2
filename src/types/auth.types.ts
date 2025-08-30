export type UserRole = 'admin' | 'manager' | 'user';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
    admin: 3,
    manager: 2,
    user: 1,
};

export function hasRoleAccess(
    userRole: UserRole,
    requiredRole: UserRole
): boolean {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

// Better Auth user type extension
export interface ExtendedUser {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
    role: UserRole; 
}
