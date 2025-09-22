'use client';

import Link from 'next/link';
import {
    Eye,
    FileText,
    PlusCircle,
    Settings,
    TrendingUp,
    User,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
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

export default function DashboardPage() {
    const { hasRole, isAdmin, currentRole } = useRole();
    const { user } = useAuth();

    // Mock data - replace with real data later
    const stats = {
        totalPosts: 12,
        totalViews: 1247,
        monthlyViews: 234,
        topPost: 'Getting Started with Next.js 15',
    };

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back, {user?.name?.split(' ')[0] || 'there'}!
                </h1>
                <p className="text-muted-foreground">
                    Here's what's happening with your blog today.
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Posts
                        </CardTitle>
                        <FileText className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalPosts}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            Published articles
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Views
                        </CardTitle>
                        <Eye className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalViews.toLocaleString()}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            All time views
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            This Month
                        </CardTitle>
                        <TrendingUp className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            +{stats.monthlyViews}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            Views this month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Role
                        </CardTitle>
                        <User className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">
                            {currentRole}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            Account type
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Quick Actions */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PlusCircle className="h-5 w-5" />
                            Quick Actions
                        </CardTitle>
                        <CardDescription>
                            Get started with common tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link href="/posts/create" className="block">
                            <Button className="w-full justify-start" size="lg">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                New Blog Post
                            </Button>
                        </Link>

                        <Link href="/posts" className="block">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                size="lg"
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                Manage Posts
                            </Button>
                        </Link>

                        <Link href="/editor-demo" className="block">
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                size="lg"
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                Test Editor
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Recent Activity / Top Performing */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Your latest content and performance
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Top Performing Post */}
                            <div className="flex items-start space-x-4">
                                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-foreground text-sm font-medium">
                                        Top Performing Post
                                    </p>
                                    <p className="text-muted-foreground truncate text-sm">
                                        {stats.topPost}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        234 views this week
                                    </p>
                                </div>
                            </div>

                            {/* Recent Posts Placeholder */}
                            <div className="text-muted-foreground text-sm">
                                📝 Recent posts and detailed analytics coming
                                soon...
                            </div>

                            <Link href="/posts">
                                <Button variant="outline" size="sm">
                                    View All Posts
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

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
        </div>
    );
}
