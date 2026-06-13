import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { journeyScenes } from './scenes'
import { useJourneyStore } from './store'

// Module-level scratch vectors to avoid per-frame allocations
const _targetPos = new Vector3()
const _lookDesired = new Vector3()
const _finaleZoom = new Vector3(-16, 6, -126)

const N = journeyScenes.length

export function CameraRig() {
  // Vantage point + look target per scene
  const camPositions = useMemo(
    () => journeyScenes.map((s) => new Vector3(...s.cameraPos)),
    [],
  )
  const lookTargets = useMemo(
    () =>
      journeyScenes.map((s, i) =>
        s.planet
          ? new Vector3(...s.planet.position)
          : // decollo (no planet): look toward the next scene
            new Vector3(...(journeyScenes[i + 1]?.cameraPos ?? s.cameraPos)),
      ),
    [],
  )

  const lookTarget = useRef(new Vector3(0, 0, -20))

  useFrame(({ camera }, delta) => {
    const progress = useJourneyStore.getState().progress
    const p = Math.min(1, Math.max(0, progress))

    // Continuous flight: interpolate between adjacent scene vantage points.
    const f = p * (N - 1)
    let i = Math.floor(f)
    if (i > N - 2) i = N - 2
    const frac = f - i
    // smootherstep easing for silky transitions between scenes
    const e = frac * frac * (3 - 2 * frac)

    _targetPos.copy(camPositions[i]).lerp(camPositions[i + 1], e)
    _lookDesired.copy(lookTargets[i]).lerp(lookTargets[i + 1], e)

    // Final scene: push in toward the planet for the zoom-in send-off.
    if (p >= 0.92) {
      const t = Math.min(1, (p - 0.92) / 0.08)
      _targetPos.lerp(_finaleZoom, t)
    }

    // Light, fast damping — the scroll itself is already smoothed by Lenis,
    // so this only removes any residual micro-jitter.
    const a = 1 - Math.exp(-9 * delta)
    camera.position.lerp(_targetPos, a)
    lookTarget.current.lerp(_lookDesired, a)
    camera.lookAt(lookTarget.current)
  })

  return null
}
