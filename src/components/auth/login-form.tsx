'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authClient.signIn.email({
                email,
                password,
            });

            // Redirect or handle success
            window.location.href = '/dashboard';
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
            <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-md border px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-md border px-3 py-2"
                />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-blue-500 py-2 text-white disabled:opacity-50"
            >
                {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
        </form>
    );
}
