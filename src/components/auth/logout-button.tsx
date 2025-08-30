'use client';

import { authClient } from '@/lib/auth-client';

export function LogoutButton() {
    const handleLogout = async () => {
        await authClient.signOut();
        window.location.href = '/';
    };

    return (
        <button
            onClick={handleLogout}
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
            Logout
        </button>
    );
}
