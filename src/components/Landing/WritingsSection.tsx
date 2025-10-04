'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

export default function WritingsSection() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch('/api/posts?limit=3');
                const data = await response.json();
                setPosts(data.posts || []);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    return (
        <section className="relative px-6 py-32">
            <div className="mx-auto max-w-6xl">
                {/* Section Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center text-4xl font-bold text-white md:text-5xl"
                >
                    Latest Writings
                </motion.h2>

                {/* Posts Grid */}
                {loading ? (
                    <div className="grid gap-8 md:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-64 animate-pulse rounded-lg bg-white/5"
                            />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center">
                        <p className="text-xl text-gray-400">
                            No posts yet. Check back soon!
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-3">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Link href={`/posts/${post.slug}`}>
                                    <div className="group h-full rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/10">
                                        {/* Category Badge */}
                                        <div className="mb-4">
                                            <span className="inline-block rounded-full bg-cyan-400/10 px-3 py-1 text-sm text-cyan-400">
                                                {post.category}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="mb-3 text-xl font-semibold text-white transition-colors group-hover:text-cyan-400">
                                            {post.title}
                                        </h3>

                                        {/* Meta Info */}
                                        <div className="mt-auto flex items-center gap-2 text-sm text-gray-400">
                                            <time>
                                                {new Date(
                                                    post.createdAt
                                                ).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </time>
                                        </div>

                                        {/* Tags */}
                                        {post.tags.length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {post.tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="text-xs text-gray-500"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* View All Link */}
                {!loading && posts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="mt-12 text-center"
                    >
                        <Link
                            href="/posts"
                            className="inline-flex items-center gap-2 text-lg text-cyan-400 transition-colors hover:text-cyan-300"
                        >
                            View all writings
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
