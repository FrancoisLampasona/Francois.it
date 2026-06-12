import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import type { Vec3 } from './scenes'

type PlanetProps = {
  position: Vec3
  radius: number
  color: string
}

export function Planet({ position, radius, color }: PlanetProps) {
  const ref = useRef<Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.1
  })
  return (
    <mesh ref={ref} position={[position[0], position[1], position[2]]}>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshStandardMaterial color={color} roughness={0.85} metalness={0.1} />
    </mesh>
  )
}
