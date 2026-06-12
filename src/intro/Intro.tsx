import { useEffect, useMemo, useRef, useState } from 'react'
import { greetings } from './greetings'
import { useGreetingCycle } from './useGreetingCycle'

interface IntroProps {
  onFinish: () => void
}

type Star = { top: string; left: string; size: number; delay: string; duration: string }

export function Intro({ onFinish }: IntroProps) {
  const [leaving, setLeaving] = useState(false)
  const leavingRef = useRef(false)

  // Soft scattered starfield generated once on mount
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 70 }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() < 0.85 ? 1 : 2,
        delay: `${(Math.random() * 4).toFixed(2)}s`,
        duration: `${(2.5 + Math.random() * 3).toFixed(2)}s`,
      })),
    [],
  )

  // Detect reduced-motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleDone = () => {
    if (leavingRef.current) return
    leavingRef.current = true
    setLeaving(true)
    setTimeout(onFinish, 700)
  }

  const skip = () => {
    if (leavingRef.current) return
    leavingRef.current = true
    setLeaving(true)
    setTimeout(onFinish, 700)
  }

  // Reduced motion path: show first greeting briefly then exit
  useEffect(() => {
    if (!prefersReducedMotion) return
    const id = setTimeout(() => {
      if (!leavingRef.current) {
        leavingRef.current = true
        setLeaving(true)
        setTimeout(onFinish, 700)
      }
    }, 800)
    return () => clearTimeout(id)
  }, [prefersReducedMotion, onFinish])

  // Keydown skip
  useEffect(() => {
    const handler = () => skip()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Lock body scroll
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  // Cycle greetings (disabled in reduced-motion mode — count=0 disables interval)
  const index = useGreetingCycle(
    prefersReducedMotion ? 0 : greetings.length,
    800,
    handleDone,
  )

  const displayIndex = prefersReducedMotion ? 0 : index

  return (
    <div
      role="dialog"
      aria-label="Benvenuto"
      onClick={skip}
      className={[
        'fixed inset-0 z-[60] flex items-center justify-center overflow-hidden text-white',
        'cursor-pointer select-none',
        'transition-opacity duration-700',
        leaving ? 'opacity-0' : 'opacity-100',
      ].join(' ')}
      style={{
        background:
          'radial-gradient(ellipse at 50% 38%, #111a44 0%, #070c24 45%, #02040e 100%)',
      }}
    >
      {/* Starfield */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: s.top,
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animation: `introTwinkle ${s.duration} ease-in-out ${s.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* Greeting */}
      <div aria-live="polite" className="relative text-center px-6">
        <span
          key={displayIndex}
          className="intro-greeting block font-normal leading-none"
          style={{
            fontFamily: '"Sacramento", cursive',
            fontSize: 'clamp(4.5rem, 15vw, 15rem)',
            whiteSpace: 'nowrap',
          }}
        >
          {greetings[displayIndex]}
        </span>
      </div>

      {/* Signature */}
      <p
        className="absolute bottom-10 right-10 text-xl italic text-white/90 underline decoration-white/50 underline-offset-[6px]"
        style={{ fontFamily: '"Cormorant Garamond", serif' }}
      >
        in the mind of Francois Lampasona
      </p>

      {/* Skip button */}
      <button
        aria-label="Entra nel sito"
        onClick={e => { e.stopPropagation(); skip() }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] text-white/40 hover:text-white/70 transition-colors"
      >
        ENTRA ↓
      </button>
    </div>
  )
}
