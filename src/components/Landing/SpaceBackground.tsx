'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { PointMaterial, Points } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Stars({ isDark }: { isDark: boolean }) {
    const ref = useRef<THREE.Points>(null);

    // Generate random star positions
    const particles = useMemo(() => {
        const positions = new Float32Array(5000 * 3);
        for (let i = 0; i < 5000; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = (Math.random() - 0.5) * 100;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;
        }
        return positions;
    }, []);

    // Subtle rotation animation
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 40;
            ref.current.rotation.y -= delta / 50;
        }
    });

    return (
        <Points
            ref={ref}
            positions={particles}
            stride={3}
            frustumCulled={false}
        >
            <PointMaterial
                transparent
                color={isDark ? '#ffffff' : '#1e293b'}
                size={0.15}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={isDark ? 0.8 : 0.3}
            />
        </Points>
    );
}

export default function SpaceBackground() {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDark = mounted ? currentTheme === 'dark' : true; // Default to dark during SSR

    return (
        <div className="fixed inset-0 -z-10">
            {/* Dynamic gradient background */}
            <div
                className={`absolute inset-0 transition-colors duration-500 ${
                    isDark
                        ? 'bg-gradient-to-b from-[#0a0e27] via-[#1a1147] to-[#0d1b2a]'
                        : 'bg-gradient-to-b from-blue-200 via-purple-100 to-cyan-200'
                }`}
            />

            {/* 3D Starfield */}
            <Canvas
                camera={{ position: [0, 0, 1], fov: 75 }}
                className="absolute inset-0"
            >
                <Stars isDark={isDark} />
            </Canvas>

            {/* Subtle overlay for depth */}
            <div
                className={`absolute inset-0 transition-colors duration-500 ${
                    isDark
                        ? 'bg-gradient-to-t from-black/30 via-transparent to-transparent'
                        : 'bg-gradient-to-t from-white/20 via-transparent to-transparent'
                }`}
            />
        </div>
    );
}
