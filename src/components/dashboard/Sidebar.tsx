'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    ChevronLeft,
    ChevronRight,
    LogOut,
    Settings,
    User,
} from 'lucide-react';
import { signOut } from '@/lib/auth-client';
import {
    NavigationItem,
    NavigationSection,
    getNavigationForRole,
} from '@/lib/dashboard/navigation-config';
import { cn } from '@/lib/utils';
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

interface SidebarProps {
    collapsed?: boolean;
    onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const { role, user } = useAuth();
    const router = useRouter();

    const navigationSections = getNavigationForRole(role);

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <aside
            className={cn(
                'flex h-full flex-col border transition-all duration-300',
                collapsed ? 'w-16' : 'w-64'
            )}
        >
            {/* Navigation Content - only scroll if needed */}
            <nav className="scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-muted-foreground/20 flex-1 space-y-6 overflow-x-hidden overflow-y-auto p-4 pb-0">
                {navigationSections.map((section) => (
                    <NavigationSectionComponent
                        key={section.title}
                        section={section}
                        collapsed={collapsed}
                        currentPathname={pathname}
                    />
                ))}
            </nav>

            {/* User Profile Section & Toggle - Combined in one row */}
            <div className="border-border mt-auto border-t p-3">
                <div className="flex items-center gap-1">
                    {/* User Profile - takes available space */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className={cn(
                                    'hover:bg-accent/50 h-auto min-w-0 flex-1 justify-start p-2',
                                    collapsed &&
                                        'w-8 flex-none justify-center px-0'
                                )}
                            >
                                {/* User Avatar */}
                                <div className="bg-primary text-primary-foreground flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>

                                {/* User Info - Hidden when collapsed */}
                                {!collapsed && (
                                    <div className="ml-2 flex min-w-0 flex-1 flex-col items-start">
                                        <div className="w-full truncate text-left text-xs font-medium">
                                            {user?.name || 'User'}
                                        </div>
                                        <div className="text-muted-foreground w-full truncate text-left text-[10px]">
                                            {user?.email}
                                        </div>
                                    </div>
                                )}
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align={collapsed ? 'center' : 'start'}
                            side={collapsed ? 'right' : 'top'}
                            className="w-56"
                        >
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={() =>
                                    router.push('/dashboard/profile')
                                }
                                className="cursor-pointer"
                            >
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() =>
                                    router.push('/dashboard/settings')
                                }
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

                    {/* Toggle Button - always visible */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggle}
                        className="text-muted-foreground hover:text-foreground h-6 w-6 flex-shrink-0 opacity-60 transition-colors hover:opacity-100"
                    >
                        {collapsed ? (
                            <ChevronRight className="h-3 w-3" />
                        ) : (
                            <ChevronLeft className="h-3 w-3" />
                        )}
                    </Button>
                </div>
            </div>
        </aside>
    );
}

interface NavigationSectionProps {
    section: NavigationSection;
    collapsed: boolean;
    currentPathname: string;
}

function NavigationSectionComponent({
    section,
    collapsed,
    currentPathname,
}: NavigationSectionProps) {
    return (
        <div>
            {/* Section Title */}
            {!collapsed && (
                <h3 className="text-muted-foreground mb-2 px-2 text-xs font-semibold tracking-wider uppercase">
                    {section.title}
                </h3>
            )}

            {/* Navigation Items */}
            <ul className="space-y-1">
                {section.items.map((item) => (
                    <NavigationItemComponent
                        key={item.href}
                        item={item}
                        collapsed={collapsed}
                        isActive={
                            item.isActive?.(currentPathname) ||
                            item.href === currentPathname
                        }
                    />
                ))}
            </ul>
        </div>
    );
}

interface NavigationItemProps {
    item: NavigationItem;
    collapsed: boolean;
    isActive: boolean;
}

function NavigationItemComponent({
    item,
    collapsed,
    isActive,
}: NavigationItemProps) {
    const IconComponent = item.icon;

    return (
        <li>
            <Link
                href={item.href}
                className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus-visible:bg-accent focus-visible:text-accent-foreground',
                    'outline-none focus:outline-none',
                    isActive &&
                        'bg-primary text-primary-foreground hover:bg-primary/90',
                    collapsed ? 'justify-center' : 'justify-start'
                )}
                title={
                    collapsed
                        ? `${item.label}${item.description ? ` - ${item.description}` : ''}`
                        : undefined
                }
            >
                <IconComponent className="h-4 w-4 flex-shrink-0" />

                {!collapsed && (
                    <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                            <span
                                className={cn(
                                    'inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium',
                                    isActive
                                        ? 'bg-primary-foreground text-primary'
                                        : 'bg-secondary text-secondary-foreground'
                                )}
                            >
                                {item.badge}
                            </span>
                        )}
                    </>
                )}
            </Link>
        </li>
    );
}

// Mobile Sidebar Overlay (for future responsive implementation)
interface MobileSidebarProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function MobileSidebar({ open, onClose, children }: MobileSidebarProps) {
    if (!open) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">
                {children}
            </div>
        </>
    );
}
