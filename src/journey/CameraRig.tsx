import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { journeyScenes } from './scenes'
import { sceneIndexForProgress, useJourneyStore } from './store'

// Module-level scratch vectors to avoid per-frame allocations
const _targetPos = new Vector3()
const _lookDesired = new Vector3()
const _finaleZoom = new Vector3(-16, 6, -126)

export function CameraRig() {
  // Precompute camera positions and look targets per scene
  const camPositions = useMemo(
    () => journeyScenes.map((s) => new Vector3(...s.cameraPos)),
    [],
  )
  const lookTargets = useMemo(
    () =>
      journeyScenes.map((s, i) =>
        s.planet
          ? new Vector3(...s.planet.position)
          : // decollo (no planet): look slightly ahead toward the next scene
            new Vector3(...(journeyScenes[i + 1]?.cameraPos ?? s.cameraPos)),
      ),
    [],
  )

  const lookTarget = useRef(new Vector3(0, 0, -20))

  useFrame(({ camera }, delta) => {
    const progress = useJourneyStore.getState().progress
    const active = sceneIndexForProgress(progress)
    const alphaPos = 1 - Math.exp(-3.2 * delta)
    const alphaLook = 1 - Math.exp(-3.2 * delta)

    // The camera rests on (snaps to) the active scene's vantage point.
    _targetPos.copy(camPositions[active])

    // Final scene: push in toward the planet for a zoom-in send-off.
    if (active === journeyScenes.length - 1 && progress >= 0.92) {
      const t = Math.min(1, (progress - 0.92) / 0.08)
      _targetPos.lerp(_finaleZoom, t)
    }

    camera.position.lerp(_targetPos, alphaPos)

    _lookDesired.copy(lookTargets[active])
    lookTarget.current.lerp(_lookDesired, alphaLook)
    camera.lookAt(lookTarget.current)
  })

  return null
}
