import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { JOURNEY_BG, journeyScenes } from './scenes'
import { isWebGLSupported, prefersReducedMotion } from './capabilities'
import { useJourneyStore } from './store'
import { JourneyBackdrop } from './JourneyBackdrop'
import { JourneyOverlay } from './JourneyOverlay'
import { JourneyStatic } from './JourneyStatic'

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger)
}

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
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => setProgress(self.progress),
    })
    return () => trigger.kill()
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
    <div ref={containerRef} className="relative" style={{ height: `${journeyScenes.length * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <JourneyBackdrop />
        <Suspense fallback={<div className="h-full w-full bg-transparent" style={{ backgroundColor: JOURNEY_BG }} />}>
          <JourneyCanvas />
        </Suspense>
        <JourneyOverlay />
      </div>
    </div>
  )
}
