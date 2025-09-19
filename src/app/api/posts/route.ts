import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Post, { ICreatePost } from '@/models/post.model';
import connectDB from '@/utils/mongodb.util';

export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const { title, content, contentHtml, category, tags } = body;

        if (!title || !content || !contentHtml || !category) {
            return NextResponse.json(
                {
                    error: 'Missing required fields',
                    details:
                        'Title, content, contentHtml, and category are required',
                },
                { status: 400 }
            );
        }

        if (title.length < 3 || title.length > 200) {
            return NextResponse.json(
                { error: 'Title must be between 3 and 200 characters' },
                { status: 400 }
            );
        }

        if (!Array.isArray(content)) {
            return NextResponse.json(
                {
                    error: 'Content must be valid BlockNote JSON format (array of blocks)',
                },
                { status: 400 }
            );
        }

        if (
            typeof contentHtml !== 'string' ||
            contentHtml.trim().length === 0
        ) {
            return NextResponse.json(
                {
                    error: 'contentHtml must be a non-empty string',
                },
                { status: 400 }
            );
        }

        const validatedTags = Array.isArray(tags) ? tags.slice(0, 10) : [];

        const generateSlug = (title: string): string => {
            const baseSlug = title
                .toLowerCase()
                .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
                .trim();

            return baseSlug
                ? `${baseSlug}-${Date.now()}`
                : `post-${Date.now()}`;
        };

        const postData = {
            title: title.trim(),
            content: JSON.stringify(content), // Store BlockNote JSON as string (for editing)
            contentHtml: contentHtml.trim(), // Store pre-generated HTML (for display)
            category: category.trim().toLowerCase(),
            tags: validatedTags,
            slug: generateSlug(title.trim()),
            authorId: session.user.id,
            authorName: session.user.name || 'Anonymous',
        };

        console.log('Creating post with data:', {
            title: postData.title,
            slug: postData.slug,
            category: postData.category,
            contentHtmlLength: postData.contentHtml.length,
            contentJsonLength: postData.content.length,
        });

        const post = new Post(postData);

        const savedPost = await post.save();

        console.log('Post saved successfully with slug:', savedPost.slug);

        const responsePost = {
            id: savedPost._id,
            title: savedPost.title,
            slug: savedPost.slug,
            category: savedPost.category,
            tags: savedPost.tags,
            authorName: savedPost.authorName,
            createdAt: savedPost.createdAt,
            updatedAt: savedPost.updatedAt,
        };

        return NextResponse.json(
            {
                message: 'Post created successfully',
                post: responsePost,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating post:', error);
        console.error('Error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
        });

        if (error instanceof Error && error.name === 'ValidationError') {
            console.error('Validation errors:', (error as any).errors);
            return NextResponse.json(
                {
                    error: 'Validation error',
                    details: error.message,
                    validationErrors: (error as any).errors,
                },
                { status: 400 }
            );
        }

        if (error instanceof Error && 'code' in error && error.code === 11000) {
            return NextResponse.json(
                { error: 'A post with this title already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const category = searchParams.get('category');
        const tag = searchParams.get('tag');
        const author = searchParams.get('author');

        const validPage = Math.max(1, page);
        const validLimit = Math.min(Math.max(1, limit), 50); 
        const skip = (validPage - 1) * validLimit;

        const filter: any = {};

        if (category) {
            filter.category = category.toLowerCase();
        }

        if (tag) {
            filter.tags = tag.toLowerCase();
        }

        if (author) {
            filter.authorId = author;
        }

        const posts = await Post.find(filter)
            .select('-content -contentHtml') // Exclude both content fields for list view (performance)
            .sort({ createdAt: -1 }) // Newest first
            .skip(skip)
            .limit(validLimit)
            .lean(); // Better performance for read-only data

        const total = await Post.countDocuments(filter);

        const totalPages = Math.ceil(total / validLimit);
        const hasNextPage = validPage < totalPages;
        const hasPrevPage = validPage > 1;

        return NextResponse.json({
            posts,
            pagination: {
                page: validPage,
                limit: validLimit,
                total,
                totalPages,
                hasNextPage,
                hasPrevPage,
            },
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
