import { useRef } from 'react'
import { Billboard, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { Mesh, MeshBasicMaterial } from 'three'
import type { Vec3 } from './scenes'
import { sceneIndexForProgress, useJourneyStore } from './store'

type SceneSpriteProps = {
  url: string
  position: Vec3
  scale: number
  // Scene index this sprite belongs to; it fades in only on its scene.
  sceneIndex: number
}

export function SceneSprite({ url, position, scale, sceneIndex }: SceneSpriteProps) {
  const texture = useTexture(url)
  const meshRef = useRef<Mesh>(null)
  const opacity = useRef(0)

  useFrame((_, delta) => {
    const active = sceneIndexForProgress(useJourneyStore.getState().progress)
    const target = active === sceneIndex ? 1 : 0
    opacity.current += (target - opacity.current) * (1 - Math.exp(-6 * delta))
    const mesh = meshRef.current
    if (mesh) {
      const mat = mesh.material as MeshBasicMaterial
      mat.opacity = opacity.current
      mesh.visible = opacity.current > 0.01
    }
  })

  return (
    <Billboard position={[position[0], position[1], position[2]]}>
      <mesh ref={meshRef} scale={scale} visible={false}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} transparent depthWrite={false} opacity={0} />
      </mesh>
    </Billboard>
  )
}
