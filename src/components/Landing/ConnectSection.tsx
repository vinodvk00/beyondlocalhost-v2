'use client';

import { motion } from 'framer-motion';

const socialLinks = [
    {
        name: 'GitHub',
        url: 'https://github.com/vinodvk00',
        icon: (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        hoverText: 'Where I commit my work',
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/iamvinod00/',
        icon: (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
        hoverText: "Professional networking, let's connect",
    },
    {
        name: 'X',
        url: 'https://x.com/iamvinod0',
        icon: (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        hoverText: "Random thoughts and things I probably don't understand yet",
    },
    {
        name: 'Email',
        url: 'mailto:vinodkumar197904@gmail.com',
        icon: (
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
            </svg>
        ),
        hoverText: 'Write to me at vinodkumar197904@gmail.com',
    },
];

export default function ConnectSection() {
    return (
        <footer className="relative border-t border-border px-6 py-16">
            <div className="mx-auto max-w-4xl">
                {/* Social Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-8 flex flex-wrap items-center justify-center gap-6"
                >
                    {socialLinks.map((link, index) => (
                        <motion.a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative cursor-pointer"
                        >
                            {/* Icon */}
                            <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:border-cyan-400 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-400">
                                {link.icon}
                            </div>

                            {/* Tooltip on hover */}
                            <div className="pointer-events-none absolute bottom-16 left-1/2 z-10 w-48 -translate-x-1/2 rounded-lg border border-cyan-500/50 bg-white/95 px-3 py-2 text-center text-sm text-gray-700 opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 dark:border-cyan-400/50 dark:bg-gray-900/95 dark:text-gray-300">
                                <div className="mb-1 font-semibold text-cyan-600 dark:text-cyan-400">
                                    {link.name}
                                </div>
                                <div className="text-xs">{link.hoverText}</div>
                                {/* Arrow */}
                                <div className="absolute -bottom-[5px] left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-cyan-500/50 bg-white/95 dark:border-cyan-400/50 dark:bg-gray-900/95"></div>
                            </div>
                        </motion.a>
                    ))}
                </motion.div>

                {/* Footer Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center text-muted-foreground"
                >
                    <p className="text-sm">
                        beyondlocalhost © {new Date().getFullYear()}
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}
