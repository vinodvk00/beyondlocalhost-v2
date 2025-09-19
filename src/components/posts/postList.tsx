'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Calendar,
    FileText,
    Folder,
    PlusCircle,
    Tag,
    User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Post {
    _id: string;
    title: string;
    slug: string;
    category: string;
    tags: string[];
    authorName: string;
    createdAt: string;
    updatedAt: string;
}

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface PostsResponse {
    posts: Post[];
    pagination: PaginationInfo;
}

export default function PostsList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [categoryFilter, setCategoryFilter] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch posts
    const fetchPosts = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            // Build query parameters
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
            });

            if (categoryFilter) params.append('category', categoryFilter);
            if (tagFilter) params.append('tag', tagFilter);

            const response = await fetch(`/api/posts?${params}`);

            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const data: PostsResponse = await response.json();
            setPosts(data.posts);
            setPagination(data.pagination);
            setCurrentPage(page);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError(
                err instanceof Error ? err.message : 'Failed to fetch posts'
            );
        } finally {
            setLoading(false);
        }
    };

    // Load posts on component mount and filter changes
    useEffect(() => {
        fetchPosts(1);
    }, [categoryFilter, tagFilter]);

    // Handle page change
    const handlePageChange = (page: number) => {
        fetchPosts(page);
    };

    // Clear filters
    const clearFilters = () => {
        setCategoryFilter('');
        setTagFilter('');
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading && posts.length === 0) {
        return (
            <div className="mx-auto max-w-6xl p-6">
                <div className="py-12 text-center">
                    <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
                    <p className="text-muted-foreground">Loading posts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-6xl p-6">
                <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                    <CardHeader>
                        <CardTitle className="text-red-600 dark:text-red-400">
                            Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-700 dark:text-red-300">
                            {error}
                        </p>
                        <Button onClick={() => fetchPosts(1)} className="mt-4">
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold">Blog Posts</h1>
                    <p className="text-muted-foreground">
                        {pagination
                            ? `${pagination.total} total posts`
                            : 'Discover our latest content'}
                    </p>
                </div>
                <Link href="/posts/create">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Post
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                placeholder="Filter by category..."
                                value={categoryFilter}
                                onChange={(e) =>
                                    setCategoryFilter(e.target.value)
                                }
                            />
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="tag">Tag</Label>
                            <Input
                                id="tag"
                                placeholder="Filter by tag..."
                                value={tagFilter}
                                onChange={(e) => setTagFilter(e.target.value)}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button variant="outline" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Posts List */}
            {posts.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <div className="text-muted-foreground mb-4">
                            <FileText className="mx-auto mb-2 h-12 w-12" />
                            <p className="text-lg">No posts found</p>
                            <p className="text-sm">
                                {categoryFilter || tagFilter
                                    ? 'Try adjusting your filters or create your first post.'
                                    : 'Be the first to create a post!'}
                            </p>
                        </div>
                        <Link href="/posts/create">
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create First Post
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {posts.map((post) => (
                        <Card
                            key={post._id}
                            className="transition-shadow hover:shadow-md"
                        >
                            <CardHeader>
                                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                                    <div className="flex-1">
                                        <CardTitle className="mb-2 text-xl">
                                            <Link
                                                href={`/posts/${post.slug}`}
                                                className="hover:text-primary transition-colors"
                                            >
                                                {post.title}
                                            </Link>
                                        </CardTitle>
                                        <CardDescription className="flex flex-wrap items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {post.authorName}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(post.createdAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Folder className="h-3 w-3" />
                                                {post.category}
                                            </span>
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            {post.tags.length > 0 && (
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs"
                                            >
                                                <Tag className="h-3 w-3" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
                        <div className="text-muted-foreground text-sm">
                            Page {pagination.page} of {pagination.totalPages}(
                            {pagination.total} total posts)
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={!pagination.hasPrevPage || loading}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={!pagination.hasNextPage || loading}
                            >
                                Next
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
