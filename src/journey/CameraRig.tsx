import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CatmullRomCurve3, Vector3 } from 'three'
import { journeyScenes } from './scenes'
import { sceneIndexForProgress, useJourneyStore } from './store'

export function CameraRig() {
  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        journeyScenes.map((s) => new Vector3(...s.cameraPos)),
        false,
        'catmullrom',
        0.3,
      ),
    [],
  )
  const lookTarget = useRef(new Vector3(0, 0, -20))

  useFrame(({ camera }) => {
    const progress = useJourneyStore.getState().progress
    const point = curve.getPointAt(Math.min(progress, 0.9999))
    camera.position.lerp(point, 0.08)

    const scene = journeyScenes[sceneIndexForProgress(progress)]
    const desired = scene.planet
      ? new Vector3(...scene.planet.position)
      : curve.getPointAt(Math.min(progress + 0.05, 0.9999))
    lookTarget.current.lerp(desired, 0.06)
    camera.lookAt(lookTarget.current)
  })

  return null
}
