import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Post from '@/models/post.model';
import connectDB from '@/utils/mongodb.util';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();

        const { slug } = await params;

        if (!slug) {
            return NextResponse.json(
                { error: 'Slug parameter is required' },
                { status: 400 }
            );
        }

        const post = await Post.findOne({ slug }).lean();

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        const responsePost = {
            ...post,
            content: JSON.parse(post.content),
            contentHtml: post.contentHtml,
        };

        return NextResponse.json({ post: responsePost });
    } catch (error) {
        console.error('Error fetching post:', error);

        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: 'Invalid post content format' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> } // ← Changed: Promise<{ slug: string }>
) {
    try {
        await connectDB();

        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { slug } = await params;
        const body = await request.json();
        const { title, content, contentHtml, category, tags } = body;

        const post = await Post.findOne({ slug });

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        if (post.authorId.toString() !== session.user.id) {
            return NextResponse.json(
                { error: 'You can only edit your own posts' },
                { status: 403 }
            );
        }

        if (title) {
            post.title = title.trim();
        }

        if (content) {
            if (!Array.isArray(content)) {
                return NextResponse.json(
                    {
                        error: 'Content must be valid BlockNote JSON format (array of blocks)',
                    },
                    { status: 400 }
                );
            }

            if (
                !contentHtml ||
                typeof contentHtml !== 'string' ||
                contentHtml.trim().length === 0
            ) {
                return NextResponse.json(
                    {
                        error: 'contentHtml must be provided when updating content',
                    },
                    { status: 400 }
                );
            }

            post.content = JSON.stringify(content);
            post.contentHtml = contentHtml.trim();

            console.log('Updated post content:', {
                contentJsonLength: post.content.length,
                contentHtmlLength: post.contentHtml.length,
            });
        }

        if (category) {
            post.category = category.trim().toLowerCase();
        }

        if (tags) {
            const validatedTags = Array.isArray(tags) ? tags.slice(0, 10) : [];
            post.tags = validatedTags;
        }

        await post.save();

        console.log('Post updated successfully:', post.slug);

        const responsePost = {
            id: post._id,
            title: post.title,
            slug: post.slug,
            category: post.category,
            tags: post.tags,
            authorName: post.authorName,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };

        return NextResponse.json({
            message: 'Post updated successfully',
            post: responsePost,
        });
    } catch (error) {
        console.error('Error updating post:', error);

        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json(
                {
                    error: 'Validation error',
                    details: error.message,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();

        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { slug } = await params;

        const post = await Post.findOne({ slug });

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        if (post.authorId.toString() !== session.user.id) {
            // TODO: Add admin role check here
            return NextResponse.json(
                { error: 'You can only delete your own posts' },
                { status: 403 }
            );
        }

        await Post.findOneAndDelete({ slug });

        return NextResponse.json({
            message: 'Post deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
