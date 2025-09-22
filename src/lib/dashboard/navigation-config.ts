import {
    BarChart3,
    FileText,
    Folder,
    Home,
    PlusCircle,
    Save,
    Settings,
    Tag,
    User,
    Wrench,
} from 'lucide-react';
import { UserRole } from '@/types/auth.types';

export interface NavigationItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    description?: string;
    roles?: UserRole[]; 
    isActive?: (pathname: string) => boolean;
}

export interface NavigationSection {
    title: string;
    items: NavigationItem[];
    roles?: UserRole[];
}

export const navigationConfig: NavigationSection[] = [
    {
        title: 'Overview',
        items: [
            {
                label: 'Dashboard',
                href: '/dashboard',
                icon: Home,
                description: 'Overview and quick actions',
                isActive: (pathname) => pathname === '/dashboard',
            },
        ],
    },
    {
        title: 'Content',
        items: [
            {
                label: 'Posts',
                href: '/posts',
                icon: FileText,
                description: 'Manage your blog posts',
                isActive: (pathname) => pathname.startsWith('/posts'),
            },
            {
                label: 'New Post',
                href: '/posts/create',
                icon: PlusCircle,
                description: 'Create a new blog post',
                isActive: (pathname) => pathname === '/posts/create',
            },
            {
                label: 'Drafts',
                href: '/dashboard/drafts',
                icon: Save,
                badge: '0', // Will be dynamic
                description: 'Your draft posts',
                isActive: (pathname) => pathname === '/dashboard/drafts',
            },
            // Future features (commented out for now)
            // {
            //     label: 'Categories',
            //     href: '/dashboard/categories',
            //     icon: Folder,
            //     description: 'Manage post categories',
            // },
            // {
            //     label: 'Tags',
            //     href: '/dashboard/tags',
            //     icon: Tag,
            //     description: 'Manage post tags',
            // },
        ],
    },
    // Future: Analytics section
    // {
    //     title: 'Analytics',
    //     items: [
    //         {
    //             label: 'Overview',
    //             href: '/dashboard/analytics',
    //             icon: BarChart3,
    //             description: 'View performance metrics',
    //         },
    //     ],
    //     roles: ['admin', 'manager'], // Example role restriction
    // },
    {
        title: 'Tools',
        items: [
            {
                label: 'Editor Demo',
                href: '/editor-demo',
                icon: Wrench,
                description: 'Test the BlockNote editor',
                isActive: (pathname) => pathname === '/editor-demo',
            },
            // Future features
            // {
            //     label: 'Media Library',
            //     href: '/dashboard/media',
            //     icon: Image,
            //     description: 'Manage images and files',
            // },
        ],
    },
    {
        title: 'Settings',
        items: [
            {
                label: 'Profile',
                href: '/dashboard/profile',
                icon: User,
                description: 'Manage your profile',
                isActive: (pathname) => pathname === '/dashboard/profile',
            },
            {
                label: 'Preferences',
                href: '/dashboard/settings',
                icon: Settings,
                description: 'App settings and preferences',
                isActive: (pathname) =>
                    pathname.startsWith('/dashboard/settings'),
            },
        ],
    },
];

export function getNavigationForRole(role: UserRole): NavigationSection[] {
    return navigationConfig
        .filter((section) => !section.roles || section.roles.includes(role))
        .map((section) => ({
            ...section,
            items: section.items.filter(
                (item) => !item.roles || item.roles.includes(role)
            ),
        }));
}

export function findActiveNavItem(pathname: string): NavigationItem | null {
    for (const section of navigationConfig) {
        for (const item of section.items) {
            if (item.isActive?.(pathname) || item.href === pathname) {
                return item;
            }
        }
    }
    return null;
}

export function getBreadcrumbs(
    pathname: string
): Array<{ label: string; href?: string }> {
    const breadcrumbs = [{ label: 'Dashboard', href: '/dashboard' }];

    const activeItem = findActiveNavItem(pathname);
    if (activeItem && activeItem.href !== '/dashboard') {
        breadcrumbs.push({ label: activeItem.label, href: activeItem.href });
    }

    return breadcrumbs;
}
