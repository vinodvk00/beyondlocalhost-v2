'use client';

import Link from 'next/link';
import { FileText, PlusCircle, Settings, User } from 'lucide-react';
import { useRole } from '@/hooks/use-role';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { RoleGuard } from '@/components/role-guard';

export default function Dashboard() {
    const { hasRole, isAdmin, currentRole } = useRole();

    return (
        <div className="mx-auto max-w-6xl space-y-8 p-6">
            <div>
                <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, {currentRole}!
                </p>
            </div>

            {/* Blog Management Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Create Post Card */}
                <Card className="transition-shadow hover:shadow-md">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                        <div className="flex items-center space-x-2">
                            <PlusCircle className="text-primary h-5 w-5" />
                            <CardTitle className="text-lg">
                                Create Post
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="mb-4">
                            Write and publish a new blog post using our editor.
                        </CardDescription>
                        <Link href="/posts/create">
                            <Button className="w-full">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                New Post
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Manage Posts Card */}
                <Card className="transition-shadow hover:shadow-md">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                        <div className="flex items-center space-x-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <CardTitle className="text-lg">My Posts</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="mb-4">
                            View, edit, and manage your published blog posts.
                        </CardDescription>
                        <Link href="/posts">
                            <Button variant="outline" className="w-full">
                                <FileText className="mr-2 h-4 w-4" />
                                View Posts
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Editor Demo Card */}
                <Card className="transition-shadow hover:shadow-md">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                        <div className="flex items-center space-x-2">
                            <Settings className="h-5 w-5 text-green-500" />
                            <CardTitle className="text-lg">
                                Editor Demo
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="mb-4">
                            Test the BlockNote editor and see output formats.
                        </CardDescription>
                        <Link href="/editor-demo">
                            <Button variant="outline" className="w-full">
                                <Settings className="mr-2 h-4 w-4" />
                                Try Editor
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Quick Actions</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/posts/create">
                            <Button size="sm">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Write Post
                            </Button>
                        </Link>
                        <Link href="/posts">
                            <Button variant="outline" size="sm">
                                <FileText className="mr-2 h-4 w-4" />
                                All Posts
                            </Button>
                        </Link>
                        <Link href="/editor-demo">
                            <Button variant="ghost" size="sm">
                                <Settings className="mr-2 h-4 w-4" />
                                Test Editor
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Admin Panel - Only show to admins */}
            <RoleGuard requiredRole="admin">
                <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                    <CardHeader>
                        <CardTitle className="text-red-600 dark:text-red-400">
                            Admin Panel
                        </CardTitle>
                        <CardDescription>
                            Administrative functions for managing the blog
                            system.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="destructive" size="sm">
                                Manage Users
                            </Button>
                            <Button variant="outline" size="sm">
                                Moderate Posts
                            </Button>
                            <Button variant="ghost" size="sm">
                                View Analytics
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </RoleGuard>

            {/* Manager Tools - Show to managers and above */}
            {hasRole('manager') && (
                <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                    <CardHeader>
                        <CardTitle className="text-blue-600 dark:text-blue-400">
                            Manager Tools
                        </CardTitle>
                        <CardDescription>
                            Content management and moderation tools.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="outline" size="sm">
                                <FileText className="mr-2 h-4 w-4" />
                                Review Posts
                            </Button>
                            <Button variant="ghost" size="sm">
                                View Reports
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Conditional rendering for role-specific actions */}
            {isAdmin() && (
                <div className="rounded-lg bg-yellow-100 p-4 dark:bg-yellow-900">
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                        Super Admin Actions
                    </h3>
                    <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                        You have full access to all system functions.
                    </p>
                </div>
            )}
        </div>
    );
}
