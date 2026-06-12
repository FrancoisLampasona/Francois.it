import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CatmullRomCurve3, Vector3 } from 'three'
import { journeyScenes } from './scenes'
import { sceneIndexForProgress, useJourneyStore } from './store'

// Module-level scratch vectors to avoid per-frame allocations
const _scratchPos = new Vector3()
const _scratchDesired = new Vector3()

// Zoom target: slightly in front of the finale planet center [-10, 2, -92]
const FINALE_TARGET = new Vector3(-10, 4, -86)

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

  useFrame(({ camera }, delta) => {
    const progress = useJourneyStore.getState().progress
    const alphaPos = 1 - Math.exp(-5 * delta)
    const alphaLook = 1 - Math.exp(-4 * delta)

    curve.getPointAt(Math.min(progress, 0.9999), _scratchPos)
    camera.position.lerp(_scratchPos, alphaPos)

    if (progress >= 0.92) {
      const t = (progress - 0.92) / 0.08
      camera.position.lerp(FINALE_TARGET, 1 - Math.exp(-6 * t * delta))
    }

    const scene = journeyScenes[sceneIndexForProgress(progress)]
    if (scene.planet) {
      _scratchDesired.set(...scene.planet.position)
    } else {
      curve.getPointAt(Math.min(progress + 0.05, 0.9999), _scratchDesired)
    }
    lookTarget.current.lerp(_scratchDesired, alphaLook)
    camera.lookAt(lookTarget.current)
  })

  return null
}
