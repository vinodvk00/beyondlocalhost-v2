'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Calendar,
    Edit,
    Folder,
    Tag,
    Trash2,
    User,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface Post {
    _id: string;
    title: string;
    content: any[]; // BlockNote JSON array (for editing)
    contentHtml: string; // Rendered HTML (for display)
    slug: string;
    category: string;
    tags: string[];
    authorId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
}

export default function SinglePostView() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const slug = params.slug as string;

    // Fetch post data
    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/posts/${slug}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        setError('Post not found');
                    } else {
                        throw new Error('Failed to fetch post');
                    }
                    return;
                }

                const data = await response.json();
                console.log('Fetched post data:', data.post);
                console.log(
                    'Post contentHtml length:',
                    data.post.contentHtml?.length
                );

                setPost(data.post);
            } catch (err) {
                console.error('Error fetching post:', err);
                setError(
                    err instanceof Error ? err.message : 'Failed to fetch post'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    // Check if current user is the author
    const isAuthor =
        isAuthenticated && user && post && user.id === post.authorId;

    // Handle post deletion
    const handleDelete = async () => {
        if (!post || !isAuthor) return;

        const confirmed = window.confirm(
            'Are you sure you want to delete this post? This action cannot be undone.'
        );

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/posts/${post.slug}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            toast.success('Post deleted successfully');
            router.push('/posts');
        } catch (err) {
            console.error('Error deleting post:', err);
            toast.error('Failed to delete post');
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className="mx-auto max-w-4xl p-6">
                <div className="py-12 text-center">
                    <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
                    <p className="text-muted-foreground">Loading post...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="mx-auto max-w-4xl p-6">
                <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                    <CardHeader>
                        <CardTitle className="text-red-600 dark:text-red-400">
                            Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-red-700 dark:text-red-300">
                            {error}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => router.back()}
                                variant="outline"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Go Back
                            </Button>
                            <Button onClick={() => window.location.reload()}>
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Post not found
    if (!post) {
        return (
            <div className="mx-auto max-w-4xl p-6">
                <Card>
                    <CardContent className="py-12 text-center">
                        <h2 className="mb-2 text-2xl font-bold">
                            Post Not Found
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            The post you're looking for doesn't exist or has
                            been removed.
                        </p>
                        <Button onClick={() => router.push('/posts')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Posts
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6 p-6">
            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>

                {/* Author Actions */}
                {isAuthor && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                router.push(`/posts/${post.slug}/edit`)
                            }
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                )}
            </div>

            {/* Post Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl leading-tight font-bold">
                        {post.title}
                    </CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-4 text-base">
                        <span className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {post.authorName}
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(post.createdAt)}
                        </span>
                        <span className="flex items-center gap-2">
                            <Folder className="h-4 w-4" />
                            <span className="capitalize">{post.category}</span>
                        </span>
                    </CardDescription>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm"
                                >
                                    <Tag className="h-3 w-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </CardHeader>
            </Card>

            {/* Post Content - Use BlockNote's native HTML with proper styling */}
            <Card>
                <CardContent className="p-6">
                    <div
                        className="blocknote-content"
                        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                    />
                </CardContent>
            </Card>

            {/* Post Meta */}
            <Card>
                <CardContent className="py-4">
                    <div className="text-muted-foreground text-sm">
                        {post.updatedAt !== post.createdAt && (
                            <p>Last updated: {formatDate(post.updatedAt)}</p>
                        )}
                        <p>Post ID: {post.slug}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
