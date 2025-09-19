'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Block, PartialBlock } from '@blocknote/core';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DynamicBlockNoteEditor, {
    BlockNoteEditorRef,
} from './dynamicBlockNoteEditor';

interface CreatePostFormProps {
    onSuccess?: () => void;
}

export default function CreatePostForm({ onSuccess }: CreatePostFormProps) {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    // Form state
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Store editor content
    const [editorContent, setEditorContent] = useState<Block[]>([]);
    const editorRef = useRef<BlockNoteEditorRef>(null);

    // Handle editor content changes
    const handleEditorChange = (blocks: Block[]) => {
        setEditorContent(blocks);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated || !user) {
            toast.error('You must be logged in to create a post');
            router.push('/login');
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

        // Get content from editor ref
        if (!editorRef.current) {
            toast.error('Editor not ready. Please try again.');
            return;
        }

        const content = editorRef.current.getBlocks();
        if (!content || content.length === 0) {
            toast.error('Content is required');
            return;
        }

        // Check if content is just the placeholder
        const hasRealContent = content.some((block) => {
            if (block.content && Array.isArray(block.content)) {
                return block.content.some((inlineContent) => {
                    if (typeof inlineContent === 'string') {
                        return (
                            inlineContent !== '' &&
                            inlineContent !==
                                'Start writing your blog post here...'
                        );
                    }
                    if (inlineContent.type === 'text') {
                        return (
                            inlineContent.text.trim() !== '' &&
                            inlineContent.text !==
                                'Start writing your blog post here...'
                        );
                    }
                    return true;
                });
            }
            return false;
        });

        if (!hasRealContent) {
            toast.error('Please add some content to your post');
            return;
        }

        setIsSubmitting(true);

        try {
            // Generate HTML from BlockNote content
            const contentHtml = await editorRef.current.getHTML();

            if (!contentHtml || contentHtml.trim().length === 0) {
                throw new Error('Failed to generate HTML content');
            }

            // Prepare post data with both JSON and HTML
            const postData = {
                title: title.trim(),
                content, // BlockNote JSON array
                contentHtml, // Generated HTML
                category: category.trim(),
                tags: tags.trim()
                    ? tags
                          .split(',')
                          .map((tag) => tag.trim())
                          .filter(Boolean)
                          .slice(0, 10) // Limit to 10 tags
                    : [],
            };

            console.log(
                'Submitting post with HTML length:',
                contentHtml.length
            );

            // Submit to API
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create post');
            }

            toast.success('Post created successfully!');

            // Reset form
            setTitle('');
            setCategory('');
            setTags('');
            setEditorContent([]);

            // Call success callback or redirect
            if (onSuccess) {
                onSuccess();
            } else {
                router.push(`/posts/${result.post.slug || result.post.id}`);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error(
                error instanceof Error ? error.message : 'Failed to create post'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show login prompt if not authenticated
    if (!isAuthenticated) {
        return (
            <Card className="mx-auto max-w-2xl">
                <CardHeader>
                    <CardTitle>Authentication Required</CardTitle>
                    <CardDescription>
                        You need to be logged in to create a blog post.
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
                    <CardTitle>Create New Blog Post</CardTitle>
                    <CardDescription>
                        Share your thoughts with the world. Use the editor below
                        to create your post.
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                            <DynamicBlockNoteEditor
                                ref={editorRef}
                                onChange={handleEditorChange}
                                placeholder="Start writing your blog post here..."
                                className="min-h-[400px]"
                            />
                            <p className="text-muted-foreground text-sm">
                                Use the editor above to write your post. You can
                                format text, add headings, lists, and more.
                            </p>
                        </div>

                        {/* Author Info */}
                        <div className="bg-muted rounded-lg p-4">
                            <p className="text-sm">
                                <strong>Publishing as:</strong>{' '}
                                {user?.name || 'Anonymous'}
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
                                    ? 'Publishing...'
                                    : 'Publish Post'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
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
