import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { journeyScenes } from './scenes'
import { useJourneyStore } from './store'
import { Planet } from './Planet'
import { CameraRig } from './CameraRig'

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
      <CameraRig />
    </Canvas>
  )
}
