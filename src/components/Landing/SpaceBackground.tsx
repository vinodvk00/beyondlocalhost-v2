'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function Stars() {
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
        <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#ffffff"
                size={0.15}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.8}
            />
        </Points>
    );
}

export default function SpaceBackground() {
    return (
        <div className="fixed inset-0 -z-10">
            {/* Deep space gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27] via-[#1a1147] to-[#0d1b2a]" />

            {/* 3D Starfield */}
            <Canvas
                camera={{ position: [0, 0, 1], fov: 75 }}
                className="absolute inset-0"
            >
                <Stars />
            </Canvas>

            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
    );
}
