'use client';

import SpaceBackground from '@/components/Landing/SpaceBackground';
import HeroSection from '@/components/Landing/HeroSection';
import AboutSection from '@/components/Landing/AboutSection';
import WritingsSection from '@/components/Landing/WritingsSection';
import ConnectSection from '@/components/Landing/ConnectSection';

export default function Home() {
    return (
        <>
            <SpaceBackground />
            <main className="relative">
                <HeroSection />
                <AboutSection />
                <WritingsSection />
                <ConnectSection />
            </main>
        </>
    );
}
