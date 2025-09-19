import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// TypeScript interface for the Post document
export interface IPost extends Document {
    _id: Types.ObjectId;
    title: string;
    content: string; // BlockNote JSON as string (for editing)
    contentHtml: string; // Rendered HTML (for display)
    slug: string;
    category: string;
    tags: string[];
    authorId: Types.ObjectId;
    authorName: string; // We'll store author name for easy display
    createdAt: Date;
    updatedAt: Date;
}

// TypeScript type for creating a new post (without auto-generated fields)
export interface ICreatePost {
    title: string;
    content: string; // BlockNote JSON as string
    contentHtml: string; // Rendered HTML
    category: string;
    tags: string[];
    authorId: string;
    authorName: string;
}

// TypeScript type for updating a post
export interface IUpdatePost {
    title?: string;
    content?: string; // BlockNote JSON as string
    contentHtml?: string; // Rendered HTML
    category?: string;
    tags?: string[];
}

// Mongoose schema definition
const postSchema = new Schema<IPost>(
    {
        title: {
            type: String,
            required: [true, 'Post title is required'],
            trim: true,
            minlength: [3, 'Title must be at least 3 characters long'],
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        content: {
            type: String,
            required: [true, 'Post content is required'],
            minlength: [10, 'Content must be at least 10 characters long'],
        },
        contentHtml: {
            type: String,
            required: [true, 'Post HTML content is required'],
            minlength: [10, 'HTML content must be at least 10 characters long'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            lowercase: true,
            minlength: [2, 'Category must be at least 2 characters long'],
            maxlength: [50, 'Category cannot exceed 50 characters'],
            index: true, // For efficient filtering by category
        },
        tags: {
            type: [String],
            default: [],
            validate: {
                validator: function (tags: string[]) {
                    // Limit to 10 tags max
                    return tags.length <= 10;
                },
                message: 'Cannot have more than 10 tags',
            },
            index: true, // For efficient filtering by tags
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        authorId: {
            type: Schema.Types.ObjectId,
            required: [true, 'Author ID is required'],
            index: true,
        },
        authorName: {
            type: String,
            required: [true, 'Author name is required'],
            trim: true,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Pre-save middleware to process tags and create slug
postSchema.pre<IPost>('save', function (next) {
    // Clean and process tags
    if (this.isModified('tags')) {
        this.tags = this.tags
            .filter((tag) => tag && tag.trim()) // Remove empty tags
            .map((tag) => tag.trim().toLowerCase()) // Normalize tags
            .filter((tag, index, array) => array.indexOf(tag) === index); // Remove duplicates
    }

    // Create slug from title - ALWAYS generate if title is modified or if no slug exists
    if (this.isModified('title') || !this.slug) {
        // Create slug from title
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .trim();

        // Add timestamp to ensure uniqueness (only for new documents)
        if (this.isNew) {
            this.slug = `${this.slug}-${Date.now()}`;
        }
    }

    next();
});

// Static methods for the model
postSchema.statics = {
    // Find posts by author
    findByAuthor(authorId: string) {
        return this.find({ authorId }).sort({ createdAt: -1 });
    },

    // Find post by slug
    findBySlug(slug: string) {
        return this.findOne({ slug });
    },

    // Find posts by category
    findByCategory(category: string) {
        return this.find({ category: category.toLowerCase() }).sort({
            createdAt: -1,
        });
    },

    // Find posts by tag
    findByTag(tag: string) {
        return this.find({ tags: tag.toLowerCase() }).sort({ createdAt: -1 });
    },

    // Get all unique categories
    async getCategories() {
        return this.distinct('category');
    },

    // Get all unique tags
    async getTags() {
        return this.distinct('tags');
    },
};

// Instance methods
postSchema.methods = {
    // Get a summary of the post (first 150 characters)
    getSummary(length: number = 150): string {
        return this.content.length > length
            ? `${this.content.substring(0, length)}...`
            : this.content;
    },
};

// Export the model
const Post =
    (mongoose.models.Post as Model<IPost>) ||
    mongoose.model<IPost>('Post', postSchema);

export default Post;
