import { useRef } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { useTexture, shaderMaterial } from '@react-three/drei'
import { AdditiveBlending, BackSide, DoubleSide, Color } from 'three'
import type { Mesh } from 'three'
import type { Vec3 } from './scenes'

// Preload all planet textures at module level
useTexture.preload('/journey/tex-origini.webp')
useTexture.preload('/journey/tex-frontend.webp')
useTexture.preload('/journey/tex-backend.webp')
useTexture.preload('/journey/tex-maserati.webp')
useTexture.preload('/journey/tex-boop.webp')
useTexture.preload('/journey/tex-finale.webp')

// Atmosphere fresnel shader material created via drei helper
const AtmosphereMaterial = shaderMaterial(
  { atmColor: new Color(1, 1, 1) },
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
  // fragment shader
  `
    uniform vec3 atmColor;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      float intensity = pow(1.0 - dot(normalize(vNormal), normalize(vViewDir)), 3.0);
      gl_FragColor = vec4(atmColor, intensity * 0.7);
    }
  `,
)

type AtmosphereMaterialImpl = InstanceType<typeof AtmosphereMaterial> & { atmColor: Color }

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
}

export function Planet({ position, radius, color, texture, ring }: PlanetProps) {
  const meshRef = useRef<Mesh>(null)
  const map = useTexture(texture)
  const atmColor = new Color(color)

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.1
  })

  return (
    <group position={[position[0], position[1], position[2]]}>
      {/* Main planet sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial map={map} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Atmosphere fresnel glow shell */}
      <mesh>
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
        <mesh rotation={[-Math.PI / 2.2, 0, 0]}>
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
