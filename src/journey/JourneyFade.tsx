import { useJourneyStore } from './store'
import { JOURNEY_BG } from './scenes'

const FADE_START = 0.92

export function JourneyFade() {
  const progress = useJourneyStore((s) => s.progress)
  const opacity = progress < FADE_START ? 0 : (progress - FADE_START) / (1 - FADE_START)
  return (
    <div
      aria-hidden="true"
      data-fade
      className="pointer-events-none absolute inset-0 z-30"
      style={{ backgroundColor: JOURNEY_BG, opacity }}
    />
  )
}
