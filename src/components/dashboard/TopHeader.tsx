'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Bell,
    ChevronRight,
    LogOut,
    Menu,
    Search,
    Settings,
    User,
} from 'lucide-react';
import { signOut } from '@/lib/auth-client';
import { getBreadcrumbs } from '@/lib/dashboard/navigation-config';
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
import { Input } from '@/components/ui/input';
import ThemeToggleButton from '@/components/ui/theme-toggle-button';

interface TopHeaderProps {
    onMobileMenuToggle?: () => void;
    showMobileMenuButton?: boolean;
}

export function TopHeader({
    onMobileMenuToggle,
    showMobileMenuButton = false,
}: TopHeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();

    const breadcrumbs = getBreadcrumbs(pathname);

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex h-16 items-center justify-between border-b px-6 backdrop-blur">
            {/* Left Section - Mobile Menu + Breadcrumbs */}
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                {showMobileMenuButton && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onMobileMenuToggle}
                        className="lg:hidden"
                    >
                        <Menu className="h-4 w-4" />
                    </Button>
                )}

                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2 text-sm">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={crumb.label} className="flex items-center">
                                {index > 0 && (
                                    <ChevronRight className="text-muted-foreground mr-2 h-3 w-3" />
                                )}
                                {crumb.href ? (
                                    <Link
                                        href={crumb.href}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-foreground font-medium">
                                        {crumb.label}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>

            {/* Right Section - Search + Actions + User Menu */}
            <div className="flex items-center gap-2">
                {/* Search Bar (Future Feature) */}
                <div className="relative hidden md:flex">
                    <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                    <Input
                        placeholder="Search posts..."
                        className="w-64 pl-9"
                        disabled // Enable when search is implemented
                    />
                </div>

                {/* Notifications (Future Feature) */}
                <Button
                    variant="ghost"
                    size="icon"
                    disabled // Enable when notifications are implemented
                    className="relative"
                >
                    <Bell className="h-4 w-4" />
                    {/* Future: Notification badge */}
                    {/* <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" /> */}
                </Button>

                {/* Theme Toggle */}
                <ThemeToggleButton variant="circle-blur" start="top-right" />

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2"
                        >
                            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="hidden text-left md:block">
                                <div className="text-sm font-medium">
                                    {user?.name || 'User'}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                    {user?.email}
                                </div>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={() => router.push('/dashboard/profile')}
                            className="cursor-pointer"
                        >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => router.push('/dashboard/settings')}
                            className="cursor-pointer"
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
