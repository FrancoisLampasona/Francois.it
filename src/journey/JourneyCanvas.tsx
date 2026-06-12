import { Canvas } from '@react-three/fiber'
import { Stars, useTexture } from '@react-three/drei'
import { journeyScenes } from './scenes'
import { useJourneyStore } from './store'
import { Planet } from './Planet'
import { CameraRig } from './CameraRig'
import { SceneSprite } from './SceneSprite'
import type { Vec3 } from './scenes'

// Preload sprite textures so they're ready before the scene renders
useTexture.preload('/journey/castello-salemi.webp')
useTexture.preload('/journey/francois-cane.webp')

// Origini planet: center [12, 0, -14], radius 3
// Castle sits on top: planet top at y=3, plane center ~1.05 above → y=4.05
const CASTLE_POSITION: Vec3 = [12, 4.05, -14]
const CASTLE_SCALE = 3.6

// Finale planet: center [-10, 2, -92], radius 4
// Francois+dog on top surface: planet top at y=6, center ~0.6 above → y=6.6
const FRANCOIS_POSITION: Vec3 = [-10, 6.6, -92]
const FRANCOIS_SCALE = 1.6

export default function JourneyCanvas() {
  const visible = useJourneyStore((s) => s.journeyVisible)
  return (
    <Canvas
      camera={{ fov: 60, position: [0, 0, 10] }}
      dpr={[1, 2]}
      frameloop={visible ? 'always' : 'never'}
      gl={{ alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 10, 6]} intensity={1.2} />
      <Stars radius={140} depth={90} count={4000} factor={4} saturation={0} fade speed={0.4} />
      {journeyScenes.map(
        (scene) =>
          scene.planet && (
            <Planet
              key={scene.id}
              position={scene.planet.position}
              radius={scene.planet.radius}
              color={scene.planet.color}
            />
          ),
      )}
      <SceneSprite
        url="/journey/castello-salemi.webp"
        position={CASTLE_POSITION}
        scale={CASTLE_SCALE}
      />
      <SceneSprite
        url="/journey/francois-cane.webp"
        position={FRANCOIS_POSITION}
        scale={FRANCOIS_SCALE}
      />
      <CameraRig />
    </Canvas>
  )
}
