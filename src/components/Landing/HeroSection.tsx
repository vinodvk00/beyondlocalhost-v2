'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
        <section className="relative flex min-h-screen items-center justify-center px-6">
            <div className="max-w-4xl text-center">
                {/* Main brand name */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 text-6xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl"
                >
                    beyondlocalhost
                </motion.h1>

                {/* Animated underline */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="mx-auto mb-12 h-[2px] max-w-md bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                />

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-xl leading-relaxed text-gray-300 md:text-2xl"
                >
                    Building, breaking, and learning in web development and
                    cybersecurity
                </motion.p>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="flex flex-col items-center gap-2 text-gray-400"
                    >
                        <span className="text-sm">Scroll to explore</span>
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
