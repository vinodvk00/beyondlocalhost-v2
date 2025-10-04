'use client';

import { motion } from 'framer-motion';

export default function AboutSection() {
    return (
        <section className="relative px-6 py-32">
            <div className="mx-auto max-w-3xl text-center">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-2xl leading-relaxed text-gray-300 md:text-3xl"
                >
                    beyondlocalhost is where I document my journey through
                    code—sharing what I learn, what I build, and what breaks
                    along the way.
                </motion.p>
            </div>
        </section>
    );
}
