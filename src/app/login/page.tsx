'use client';

import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import SignIn from '@/components/auth/sign-in';

export default function LoginPage() {
    return (
        <AuthGuard>
            <div className="flex min-h-screen justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm">
                            Don't have an account?{' '}
                            <Link
                                href="/register"
                                className="font-medium text-blue-400 hover:text-blue-500"
                            >
                                Sign up here
                            </Link>
                        </p>
                    </div>

                    <SignIn />
                </div>
            </div>
        </AuthGuard>
    );
}
