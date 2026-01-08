import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function GradientMesh() {
  const mesh = useRef()
  const mouse = useRef([0, 0])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#FAFAF9') }, // bg
      uColor2: { value: new THREE.Color('#F5F5F4') }, // bg-secondary
      uColor3: { value: new THREE.Color('#E6E6E6') }, // slightly darker
      uMouse: { value: new THREE.Vector2(0, 0) }
    }),
    []
  )

  useFrame((state) => {
    const { clock } = state
    if (mesh.current) {
      mesh.current.material.uniforms.uTime.value = clock.getElapsedTime() * 0.2

      // Smooth mouse movement
      const targetX = (state.pointer.x * 0.5 + 0.5)
      const targetY = (state.pointer.y * 0.5 + 0.5)

      uniforms.uMouse.value.lerp(new THREE.Vector2(targetX, targetY), 0.05)
    }
  })

  // Vertex Shader
  const vertexShader = `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;

    void main() {
      vUv = uv;
      vec3 pos = position; // No distortion needed on vertex for this subtle effect
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `

  // Fragment Shader
  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec2 uMouse;
    varying vec2 vUv;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Much slower, larger noise for calm look
      float noise = snoise(vUv * 1.5 + uTime * 0.05);
      float noise2 = snoise(vUv * 1.0 - uTime * 0.08 + uMouse * 0.5);
      
      // Mix colors based on noise
      vec3 color = mix(uColor1, uColor2, noise * 0.5 + 0.5);
      color = mix(color, uColor3, noise2 * 0.4 + 0.3);

      // Add very subtle grain
      float grain = (fract(sin(dot(vUv, vec2(12.9898, 78.233)*uTime)) * 43758.5453) - 0.5) * 0.05;

      gl_FragColor = vec4(color + grain, 1.0);
    }
  `

  return (
    <mesh ref={mesh} scale={[20, 20, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  )
}

export default function AmbientBackground() {
  return (
    <div className="scene-container" style={{ opacity: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]} // Optimize pixel ratio
      >
        <GradientMesh />
      </Canvas>
    </div>
  )
}
