'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { signUp } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSignUp = async () => {
        if (!email || !password || !firstName || !lastName) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (password !== passwordConfirmation) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await signUp.email(
                {
                    email,
                    password,
                    name: `${firstName} ${lastName}`,
                    // image: image
                    //     ? await convertImageToBase64(image)
                    //     : undefined,
                },
                {
                    onRequest: () => {
                        setLoading(true);
                    },
                    onResponse: () => {
                        setLoading(false);
                    },
                    onSuccess: () => {
                        toast.success('Account created successfully!');
                        router.push('/dashboard');
                    },
                    onError: (ctx) => {
                        toast.error(
                            ctx.error.message || 'Failed to create account'
                        );
                        setLoading(false);
                    },
                }
            );
        } catch (error) {
            toast.error('An unexpected error occurred');
            setLoading(false);
        }
    };

    return (
        <Card className="z-50 max-w-md rounded-md">
            <CardHeader>
                <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                    Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first-name">First name</Label>
                            <Input
                                id="first-name"
                                placeholder="Max"
                                required
                                onChange={(e) => setFirstName(e.target.value)}
                                value={firstName}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last-name">Last name</Label>
                            <Input
                                id="last-name"
                                placeholder="Robinson"
                                required
                                onChange={(e) => setLastName(e.target.value)}
                                value={lastName}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            placeholder="Password"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            Confirm Password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) =>
                                setPasswordConfirmation(e.target.value)
                            }
                            autoComplete="new-password"
                            placeholder="Confirm Password"
                        />
                    </div>

                    {/* <div className="grid gap-2">
                        <Label htmlFor="image">Profile Image (optional)</Label>
                        <div className="flex items-end gap-4">
                            {imagePreview && (
                                <div className="relative h-16 w-16 overflow-hidden rounded-sm">
                                    <Image
                                        src={imagePreview}
                                        alt="Profile preview"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                            <div className="flex w-full items-center gap-2">
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full"
                                />
                                {imagePreview && (
                                    <X
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setImage(null);
                                            setImagePreview(null);
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div> */}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                        onClick={handleSignUp}
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            'Create an account'
                        )}
                    </Button>
                </div>
            </CardContent>
            <CardFooter>
                <div className="flex w-full justify-center border-t py-4">
                    <p className="text-center text-xs text-neutral-500">
                        Secured by{' '}
                        <span className="text-orange-400">better-auth.</span>
                    </p>
                </div>
            </CardFooter>
        </Card>
    );
}

// async function convertImageToBase64(file: File): Promise<string> {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onloadend = () => resolve(reader.result as string);
//         reader.onerror = reject;
//         reader.readAsDataURL(file);
//     });
// }
