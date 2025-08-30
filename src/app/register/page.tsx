'use client';

import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import SignUp from '@/components/auth/sign-up';

export default function RegisterPage() {
    return (
        <AuthGuard>
            <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold tracking-tight">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="font-medium text-blue-400 hover:text-blue-500"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    <SignUp />
                </div>
            </div>
        </AuthGuard>
    );
}
