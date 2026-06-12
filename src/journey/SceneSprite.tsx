import { Billboard, useTexture } from '@react-three/drei'
import type { Vec3 } from './scenes'

type SceneSpriteProps = {
  url: string
  position: Vec3
  scale: number
}

export function SceneSprite({ url, position, scale }: SceneSpriteProps) {
  const texture = useTexture(url)
  return (
    <Billboard position={[position[0], position[1], position[2]]}>
      <mesh scale={scale}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} transparent depthWrite={false} />
      </mesh>
    </Billboard>
  )
}
