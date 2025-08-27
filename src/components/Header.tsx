import React from 'react';
import Link from 'next/link';
import {
    Briefcase,
    CircleUserRound,
    Library,
    Mail,
    Menu,
    Newspaper,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import ThemeToggleButton from './ui/theme-toggle-button';


export const Header = () => {
    const navLinks = [
        // { href: '/#projects', label: 'Project', icon: Briefcase },
        { href: '/#blog', label: 'Blog', icon: Newspaper },
        // { href: '/#resources', label: 'Resources', icon: Library },
        { href: '/#contact', label: 'Contact', icon: Mail },
        { href: '/#profile', label: 'profile', icon: CircleUserRound },
    ];

    return (
        <header className="sticky top-0 right-0 left-0 z-50 flex items-center justify-between p-4 backdrop-blur-sm md:px-6 md:mx-18">
            {/* Logo */}
            <Link
                href="/"
                className="text-2xl font-bold tracking-widest uppercase hover:text-gray-300"
            >
                B127.
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6">
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

                <Button>
                    Login
                </Button>


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
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
};
