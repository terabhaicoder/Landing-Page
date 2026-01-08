import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, Environment, Float, Html, useCursor } from '@react-three/drei'
import * as THREE from 'three'

function FloatingIcons() {
    return (
        <group>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Star-like shape (Octahedron) */}
                <mesh position={[-1.8, 1.2, -1]} rotation={[0, 0, Math.PI / 4]}>
                    <octahedronGeometry args={[0.3, 0]} />
                    <meshStandardMaterial color="#FFD700" roughness={0.1} metalness={0.8} />
                </mesh>
            </Float>

            <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.4} floatingRange={[-0.2, 0.2]}>
                {/* Heart/Love shape (Sphere-ish) */}
                <mesh position={[1.8, 0.8, -0.5]}>
                    <dodecahedronGeometry args={[0.25, 0]} />
                    <meshStandardMaterial color="#FF6B6B" roughness={0.2} metalness={0.5} />
                </mesh>
            </Float>

            <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.6}>
                {/* Cursor/Arrow shape (Cone) */}
                <mesh position={[1.5, -1.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
                    <coneGeometry args={[0.15, 0.4, 4]} />
                    <meshStandardMaterial color="#4ECDC4" roughness={0.1} />
                </mesh>
            </Float>

            <Float speed={1.8} rotationIntensity={0.7} floatIntensity={0.5}>
                {/* Abstract shape */}
                <mesh position={[-1.5, -1.2, 0.5]}>
                    <torusGeometry args={[0.2, 0.08, 16, 32]} />
                    <meshStandardMaterial color="#A78BFA" roughness={0.1} metalness={0.6} />
                </mesh>
            </Float>
        </group>
    )
}

function PortraitCard() {
    const ref = useRef()
    const [hovered, setHover] = useState(false)
    useCursor(hovered)

    // Portrait placeholder
    const url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80' // Smiling guy/girl placeholder

    useFrame((state, delta) => {
        if (ref.current) {
            // Smooth hover scale
            const targetScale = hovered ? 1.05 : 1
            ref.current.scale.lerp(new THREE.Vector3(targetScale * 2.5, targetScale * 3, 1), delta * 4)

            // Subtle Mouse parallax if not hovering
            // We can add logic here if needed
        }
    })

    return (
        <group>
            <Image
                ref={ref}
                url={url}
                scale={[2.5, 3]} // Portrait aspect ratio
                position={[0, 0, 0]}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                transparent
                radius={0.2} // Rounded corners
            />
        </group>
    )
}

export default function HeroAvatar() {
    return (
        <div className="hero-visual-container" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]} style={{ pointerEvents: 'auto' }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={0.8} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#blue" />
                <Environment preset="city" />

                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
                    <PortraitCard />
                </Float>

                <FloatingIcons />
            </Canvas>
        </div>
    )
}
