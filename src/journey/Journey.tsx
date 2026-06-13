import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { JOURNEY_BG, journeyScenes } from './scenes'
import { isWebGLSupported, prefersReducedMotion } from './capabilities'
import { useJourneyStore } from './store'
import { JourneyBackdrop } from './JourneyBackdrop'
import { JourneyOverlay } from './JourneyOverlay'
import { JourneyFade } from './JourneyFade'
import { JourneyStatic } from './JourneyStatic'
import { SceneLogos } from './SceneLogos'
import { startSmoothScroll } from './smoothScroll'

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger)
}

// Scroll length per scene (vh). Lower = the journey traverses faster.
const VH_PER_SCENE = 72

const JourneyCanvas = lazy(() => import('./JourneyCanvas'))

export function Journey() {
  const containerRef = useRef<HTMLDivElement>(null)
  const setProgress = useJourneyStore((s) => s.setProgress)
  const setJourneyVisible = useJourneyStore((s) => s.setJourneyVisible)
  const [mode] = useState<'3d' | 'static'>(() =>
    isWebGLSupported() && !prefersReducedMotion() ? '3d' : 'static',
  )

  useEffect(() => {
    if (mode !== '3d' || !containerRef.current) return
    const el = containerRef.current

    const stopSmooth = startSmoothScroll({
      snapCount: journeyScenes.length,
      getRange: () => ({
        start: el.offsetTop,
        length: el.offsetHeight - window.innerHeight,
      }),
    })

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => setProgress(self.progress),
    })

    return () => {
      trigger.kill()
      stopSmooth()
    }
  }, [mode, setProgress])

  useEffect(() => {
    if (mode !== '3d' || !containerRef.current) return
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setJourneyVisible(entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [mode, setJourneyVisible])

  if (mode === 'static') {
    return <JourneyStatic />
  }

  return (
    <div ref={containerRef} className="relative" style={{ height: `${journeyScenes.length * VH_PER_SCENE}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <JourneyBackdrop />
        <Suspense fallback={<div className="h-full w-full" style={{ backgroundColor: JOURNEY_BG }} />}>
          <JourneyCanvas />
        </Suspense>
        <JourneyOverlay />
        <SceneLogos />
        <JourneyFade />
      </div>
    </div>
  )
}
