'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ChevronDown,
    LogOut,
    Mail,
    Menu,
    Newspaper,
    User,
    UserCircle,
} from 'lucide-react';
import { signOut } from '@/lib/auth-client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import ThemeToggleButton from './ui/theme-toggle-button';

export const Header = () => {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const renderAuthSection = () => {
        if (isLoading) {
            return <Button disabled>Loading...</Button>;
        }

        if (isAuthenticated && user) {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="hover:bg-accent flex items-center gap-2"
                        >
                            <UserCircle className="h-4 w-4" />
                            {/* <span className="hidden md:inline">
                                {user.name}
                            </span> */}
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => router.push('/profile')}
                            className="cursor-pointer"
                        >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }

        return (
            <Button onClick={() => router.push('/login')} className="gap-2">
                <User className="h-4 w-4" />
                Login
            </Button>
        );
    };

    const navLinks = [
        // { href: '/#projects', label: 'Project', icon: Briefcase },
        { href: '/#blog', label: 'Blog', icon: Newspaper },
        // { href: '/#resources', label: 'Resources', icon: Library },
        { href: '/#contact', label: 'Contact', icon: Mail },
    ];

    return (
        <header className="sticky top-0 right-0 left-0 z-50 flex items-center justify-between p-4 backdrop-blur-sm md:mx-18 md:px-6">
            {/* Logo */}
            <Link
                href="/"
                className="text-2xl font-bold tracking-widest uppercase hover:text-gray-300"
            >
                B127.
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden gap-6 md:flex">
                <ul className="flex items-center gap-6">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className="flex items-center gap-2 transition-colors hover:text-gray-300"
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
                <ThemeToggleButton variant="circle-blur" start="top-right" />

                {renderAuthSection()}
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="transition-transform duration-200 active:scale-90"
                        >
                            <Menu className="size-8" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className="w-[250px] border-none bg-black/10 p-12 backdrop-blur-sm"
                    >
                        <nav className="mt-8 grid gap-6 text-lg font-medium">
                            {navLinks.map((link) => (
                                <SheetClose asChild key={link.href}>
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center gap-3 transition-all duration-200 active:scale-95 active:text-blue-400"
                                    >
                                        <link.icon className="size-6" />
                                        {link.label}
                                    </Link>
                                </SheetClose>
                            ))}

                            {/* Auth section in mobile menu */}
                            <div className="mt-4 border-t pt-4">
                                {renderAuthSection()}
                            </div>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
};
