'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useParams, useRouter } from 'next/navigation';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/shadcn/style.css';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import * as ButtonComponent from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import * as DropdownMenu from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Post {
    _id: string;
    title: string;
    content: any[]; // BlockNote JSON array
    contentHtml: string;
    slug: string;
    category: string;
    tags: string[];
    authorId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
}

export default function EditPostForm() {
    const params = useParams();
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const { user, isAuthenticated } = useAuth();

    const slug = params.slug as string;

    // Form state
    const [post, setPost] = useState<Post | null>(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // BlockNote editor - will be initialized with post content
    const editor = useCreateBlockNote({
        initialContent: [
            {
                type: 'paragraph',
                content: 'Loading...',
            },
        ],
    });

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
                const fetchedPost = data.post;

                // Check if user is the author
                if (
                    !isAuthenticated ||
                    !user ||
                    user.id !== fetchedPost.authorId
                ) {
                    setError('You can only edit your own posts');
                    return;
                }

                setPost(fetchedPost);
                setTitle(fetchedPost.title);
                setCategory(fetchedPost.category);
                setTags(fetchedPost.tags.join(', '));

                // Load content into BlockNote editor
                if (fetchedPost.content && Array.isArray(fetchedPost.content)) {
                    // Replace the editor's content with the loaded post content
                    editor.replaceBlocks(editor.document, fetchedPost.content);
                } else {
                    console.warn('No valid content found in post');
                }
            } catch (err) {
                console.error('Error fetching post:', err);
                setError(
                    err instanceof Error ? err.message : 'Failed to fetch post'
                );
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated && user) {
            fetchPost();
        } else if (!isAuthenticated) {
            setError('You must be logged in to edit posts');
            setLoading(false);
        }
    }, [slug, isAuthenticated, user, editor]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated || !user || !post) {
            toast.error('You must be logged in to edit posts');
            return;
        }

        // Validate form
        if (!title.trim()) {
            toast.error('Title is required');
            return;
        }

        if (!category.trim()) {
            toast.error('Category is required');
            return;
        }

        const content = editor.document;
        if (!content || content.length === 0) {
            toast.error('Content is required');
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare updated post data
            const postData = {
                title: title.trim(),
                content, // BlockNote JSON array
                category: category.trim(),
                tags: tags.trim()
                    ? tags
                          .split(',')
                          .map((tag) => tag.trim())
                          .filter(Boolean)
                    : [],
            };

            // Submit to API
            const response = await fetch(`/api/posts/${slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to update post');
            }

            toast.success('Post updated successfully!');

            // Redirect to the updated post
            router.push(`/posts/${slug}`);
        } catch (error) {
            console.error('Error updating post:', error);
            toast.error(
                error instanceof Error ? error.message : 'Failed to update post'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        router.push(`/posts/${slug}`);
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
                                Go Back
                            </Button>
                            {error === 'Post not found' && (
                                <Button onClick={() => router.push('/posts')}>
                                    View All Posts
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Show login prompt if not authenticated
    if (!isAuthenticated) {
        return (
            <Card className="mx-auto max-w-2xl">
                <CardHeader>
                    <CardTitle>Authentication Required</CardTitle>
                    <CardDescription>
                        You need to be logged in to edit blog posts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.push('/login')}>
                        Sign In
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="mx-auto max-w-4xl p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Blog Post</CardTitle>
                    <CardDescription>
                        Make changes to your blog post. All changes will be
                        saved immediately.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Enter your post title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={200}
                                required
                            />
                            <p className="text-muted-foreground text-sm">
                                {title.length}/200 characters
                            </p>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">
                                Category <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="category"
                                type="text"
                                placeholder="e.g., technology, tutorial, opinion..."
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                maxLength={50}
                                required
                            />
                            <p className="text-muted-foreground text-sm">
                                Choose a category that best describes your post
                            </p>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                type="text"
                                placeholder="javascript, react, tutorial (comma separated)"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                            <p className="text-muted-foreground text-sm">
                                Add up to 10 tags separated by commas
                            </p>
                        </div>

                        {/* Content Editor */}
                        <div className="space-y-2">
                            <Label>
                                Content <span className="text-red-500">*</span>
                            </Label>
                            <div className="bg-card min-h-[400px] rounded-lg border p-4">
                                <BlockNoteView
                                    editor={editor}
                                    theme={
                                        resolvedTheme === 'dark'
                                            ? 'dark'
                                            : 'light'
                                    }
                                    shadCNComponents={{
                                        Button: ButtonComponent,
                                        DropdownMenu,
                                    }}
                                />
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Edit your post content using the rich text
                                editor above.
                            </p>
                        </div>

                        {/* Author Info */}
                        <div className="bg-muted rounded-lg p-4">
                            <p className="text-sm">
                                <strong>Editing as:</strong>{' '}
                                {user?.name || 'Anonymous'}
                            </p>
                            <p className="text-muted-foreground text-xs">
                                Last updated:{' '}
                                {post
                                    ? new Date(post.updatedAt).toLocaleString()
                                    : 'Unknown'}
                            </p>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1"
                            >
                                {isSubmitting
                                    ? 'Saving Changes...'
                                    : 'Save Changes'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
