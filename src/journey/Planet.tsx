import { useRef } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { useTexture, shaderMaterial } from '@react-three/drei'
import { AdditiveBlending, BackSide, DoubleSide, Color } from 'three'
import type { Mesh, MeshStandardMaterial, MeshBasicMaterial } from 'three'
import type { Vec3 } from './scenes'
import { sceneIndexForProgress, useJourneyStore } from './store'

// Preload all planet textures at module level
useTexture.preload('/journey/tex-origini.webp')
useTexture.preload('/journey/tex-frontend.webp')
useTexture.preload('/journey/tex-backend.webp')
useTexture.preload('/journey/tex-maserati.webp')
useTexture.preload('/journey/tex-boop.webp')
useTexture.preload('/journey/tex-finale.webp')

// Atmosphere fresnel shader material created via drei helper
const AtmosphereMaterial = shaderMaterial(
  { atmColor: new Color(1, 1, 1), uOpacity: 1 },
  // vertex shader
  `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-worldPos.xyz);
      gl_Position = projectionMatrix * worldPos;
    }
  `,
  // fragment shader — soft diffuse rim, fades with uOpacity
  `
    uniform vec3 atmColor;
    uniform float uOpacity;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      float fresnel = 1.0 - dot(normalize(vNormal), normalize(vViewDir));
      float intensity = pow(fresnel, 4.5);
      gl_FragColor = vec4(atmColor, intensity * 0.55 * uOpacity);
    }
  `,
)

type AtmosphereMaterialImpl = InstanceType<typeof AtmosphereMaterial> & {
  atmColor: Color
  uOpacity: number
}

extend({ AtmosphereMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    atmosphereMaterial: Partial<AtmosphereMaterialImpl> & {
      key?: string | number
      ref?: React.Ref<AtmosphereMaterialImpl>
    }
  }
}

type PlanetProps = {
  position: Vec3
  radius: number
  color: string
  texture: string
  ring?: boolean
  sceneIndex: number
}

export function Planet({ position, radius, color, texture, ring, sceneIndex }: PlanetProps) {
  const meshRef = useRef<Mesh>(null)
  const atmMeshRef = useRef<Mesh>(null)
  const ringMeshRef = useRef<Mesh>(null)
  const opacityRef = useRef<number>(0)
  const map = useTexture(texture)
  const atmColor = new Color(color)

  useFrame((_, delta) => {
    // Rotate planet
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.1

    // Only the active scene's planet is shown; it fades in/out smoothly.
    const progress = useJourneyStore.getState().progress
    const active = sceneIndexForProgress(progress)
    const target = sceneIndex === active ? 1 : 0

    // Smooth damp toward target
    const cur = opacityRef.current
    opacityRef.current = cur + (target - cur) * (1 - Math.exp(-5 * delta))

    const opacity = opacityRef.current
    const visible = opacity > 0.01

    // Apply to planet surface
    if (meshRef.current) {
      meshRef.current.visible = visible
      const mat = meshRef.current.material as MeshStandardMaterial
      mat.opacity = opacity
      mat.transparent = true
    }

    // Apply to atmosphere shell (custom shader: drive its fade via uOpacity uniform)
    if (atmMeshRef.current) {
      atmMeshRef.current.visible = visible
      const mat = atmMeshRef.current.material as AtmosphereMaterialImpl
      mat.uOpacity = opacity
    }

    // Apply to ring if present
    if (ringMeshRef.current) {
      ringMeshRef.current.visible = visible
      const mat = ringMeshRef.current.material as MeshBasicMaterial
      mat.opacity = opacity * 0.45
    }
  })

  return (
    <group position={[position[0], position[1], position[2]]}>
      {/* Main planet sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial map={map} roughness={0.9} metalness={0.05} transparent />
      </mesh>

      {/* Atmosphere fresnel glow shell */}
      <mesh ref={atmMeshRef}>
        <sphereGeometry args={[radius * 1.08, 48, 48]} />
        <atmosphereMaterial
          atmColor={atmColor}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          side={BackSide}
        />
      </mesh>

      {/* Optional rings (finale planet only) */}
      {ring && (
        <mesh ref={ringMeshRef} rotation={[-Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[radius * 1.4, radius * 2.2, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            side={DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}
