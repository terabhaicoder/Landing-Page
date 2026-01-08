import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Image, Environment } from '@react-three/drei'
import { useDrag } from '@use-gesture/react'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'

function DraggableCard({ url, initialPosition, initialRotation, index }) {
    const ref = useRef()
    const { size, viewport } = useThree()
    const aspect = size.width / viewport.width

    const [isDragging, setIsDragging] = useState(false)
    const velocityRef = useRef([0, 0])

    const [spring, api] = useSpring(() => ({
        position: initialPosition,
        rotation: initialRotation,
        scale: [2.4, 1.4, 1],
        config: { mass: 1, tension: 200, friction: 20 }
    }))

    const bind = useDrag(({ active, movement: [mx, my], velocity: [vx, vy], direction: [dx, dy] }) => {
        setIsDragging(active)

        if (active) {
            // While dragging, move with cursor
            api.start({
                position: [
                    initialPosition[0] + mx / aspect,
                    initialPosition[1] - my / aspect,
                    initialPosition[2] + 2 // Bring forward while dragging
                ],
                rotation: [
                    initialRotation[0] + my * 0.001,
                    initialRotation[1] - mx * 0.001,
                    mx * 0.002 // Tilt based on movement
                ],
                scale: [2.6, 1.5, 1],
                config: { tension: 800, friction: 30 }
            })
            velocityRef.current = [vx * dx, vy * dy]
        } else {
            // On release, apply throw velocity then return home
            const throwMultiplier = 150
            const throwX = initialPosition[0] + velocityRef.current[0] * throwMultiplier / aspect
            const throwY = initialPosition[1] - velocityRef.current[1] * throwMultiplier / aspect

            // First animate to throw position
            api.start({
                position: [throwX, throwY, initialPosition[2] + 1],
                rotation: [
                    initialRotation[0] + velocityRef.current[1] * 0.5,
                    initialRotation[1] - velocityRef.current[0] * 0.5,
                    velocityRef.current[0] * 2
                ],
                scale: [2.4, 1.4, 1],
                config: { tension: 100, friction: 15 }
            })

            // Then spring back home
            setTimeout(() => {
                api.start({
                    position: initialPosition,
                    rotation: initialRotation,
                    scale: [2.4, 1.4, 1],
                    config: { tension: 120, friction: 14 }
                })
            }, 300)
        }
    }, {
        pointer: { touch: true },
        filterTaps: true
    })

    // Subtle floating animation when not dragging
    useFrame((state) => {
        if (!isDragging && ref.current) {
            const t = state.clock.getElapsedTime()
            ref.current.position.y = spring.position.get()[1] + Math.sin(t * 0.5 + index) * 0.05
        }
    })

    return (
        <animated.group
            ref={ref}
            {...(bind())}
            position={spring.position}
            rotation={spring.rotation}
            scale={spring.scale}
        >
            <Image
                url={url}
                transparent
                scale={[1, 1, 1]}
                raycast={() => null}
            />
            {/* Invisible plane for better drag detection */}
            <mesh visible={false}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
        </animated.group>
    )
}

function Deck() {
    const images = [
        'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80',
        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80',
        'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
    ]

    const cards = [
        { position: [-2, 0.8, -1], rotation: [0.1, 0.3, -0.08] },
        { position: [0, 0, 0], rotation: [0, 0, 0] },
        { position: [2, -0.8, 1], rotation: [-0.1, -0.3, 0.08] },
    ]

    return (
        <group position={[2, 0, 0]}>
            {cards.map((card, i) => (
                <DraggableCard
                    key={i}
                    index={i}
                    url={images[i]}
                    initialPosition={card.position}
                    initialRotation={card.rotation}
                />
            ))}
        </group>
    )
}

export default function HeroProjectGallery() {
    return (
        <div className="hero-visual-container" style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            cursor: 'grab'
        }}>
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                dpr={[1, 2]}
                style={{ touchAction: 'none' }}
            >
                <ambientLight intensity={0.6} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <Environment preset="city" />
                <Deck />
            </Canvas>
        </div>
    )
}
