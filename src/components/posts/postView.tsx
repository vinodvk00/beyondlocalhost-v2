'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import '@blocknote/shadcn/style.css';
import {
    ArrowLeft,
    Calendar,
    Edit,
    MoreHorizontal,
    Tag,
    Trash2,
    User,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Post {
    _id: string;
    title: string;
    content: any[];
    contentHtml: string;
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

    const isAuthor =
        isAuthenticated && user && post && user.id === post.authorId;

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-12">
                <div className="flex items-center justify-center py-24">
                    <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-12">
                <div className="text-center">
                    <h1 className="mb-4 text-2xl font-bold text-red-600">
                        {error === 'Post not found'
                            ? 'Post Not Found'
                            : 'Error'}
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        {error === 'Post not found'
                            ? "The post you're looking for doesn't exist or has been removed."
                            : error}
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button variant="outline" onClick={() => router.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Button>
                        <Button onClick={() => router.push('/posts')}>
                            View All Posts
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-12">
                <div className="text-center">
                    <h1 className="mb-4 text-2xl font-bold">Post Not Found</h1>
                    <p className="text-muted-foreground mb-6">
                        The post you're looking for doesn't exist or has been
                        removed.
                    </p>
                    <Button onClick={() => router.push('/posts')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Posts
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen">
            {/* Top Navigation Bar */}
            <div className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>

                    {/* Author Actions */}
                    {isAuthor && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() =>
                                        router.push(`/posts/${post.slug}/edit`)
                                    }
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Post
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleDelete}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Post
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <article className="mx-auto max-w-4xl px-6 py-12">
                {/* Article Header */}
                <header className="mb-12">
                    {/* Category Badge */}
                    <div className="mb-4">
                        <span className="text-primary bg-primary/10 rounded-full px-3 py-1 text-sm font-medium capitalize">
                            {post.category}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight md:text-5xl lg:text-6xl">
                        {post.title}
                    </h1>

                    {/* Author and Meta Info */}
                    <div className="text-muted-foreground flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                                {post.authorName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="text-foreground text-sm font-medium">
                                    {post.authorName}
                                </div>
                                <div className="text-xs">Author</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-4 w-4" />
                            {formatDate(post.createdAt)}
                        </div>

                        {post.updatedAt !== post.createdAt && (
                            <div className="text-xs">
                                Updated {formatDate(post.updatedAt)}
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs"
                                >
                                    <Tag className="h-3 w-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {/* Separator */}
                <div className="border-border mb-12 border-t"></div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                    <div
                        className="blocknote-content"
                        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                    />
                </div>

                {/* Footer */}
                <footer className="border-border mt-16 border-t pt-8">
                    <div className="text-muted-foreground text-sm">
                        <p className="mb-2">Article ID: {post.slug}</p>
                        <p>
                            Published on {formatDate(post.createdAt)}
                            {post.updatedAt !== post.createdAt &&
                                ` • Last updated ${formatDate(post.updatedAt)}`}
                        </p>
                    </div>
                </footer>
            </article>
        </div>
    );
}
