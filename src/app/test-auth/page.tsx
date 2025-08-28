'use client';

import { useState } from 'react';
import { signIn, signOut, signUp, useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function TestAuth() {
    const { data: session, isPending } = useSession();
    const [email, setEmail] = useState('test@example.com');
    const [password, setPassword] = useState('password123');
    const [name, setName] = useState('Test User');

    if (isPending) return <div>Loading...</div>;

    return (
        <div className="mx-auto max-w-2xl space-y-6 p-8">
            <h1 className="text-2xl font-bold">Auth Test Page</h1>

            {session ? (
                <Card>
                    <CardHeader>
                        <CardTitle>✅ Logged In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="overflow-auto rounded bg-gray-100 p-4 text-sm">
                            {JSON.stringify(session, null, 2)}
                        </pre>
                        <Button onClick={() => signOut()} className="mt-4">
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>❌ Not Logged In</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Input
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <Input
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <Input
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() =>
                                    signIn.email({ email, password })
                                }
                            >
                                Sign In
                            </Button>
                            <Button
                                onClick={() =>
                                    signUp.email({ email, password, name })
                                }
                            >
                                Sign Up
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
