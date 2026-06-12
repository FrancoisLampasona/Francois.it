import { useEffect, useRef, useState } from 'react'
import { greetings } from './greetings'
import { useGreetingCycle } from './useGreetingCycle'

interface IntroProps {
  onFinish: () => void
}

export function Intro({ onFinish }: IntroProps) {
  const [leaving, setLeaving] = useState(false)
  const leavingRef = useRef(false)

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
    650,
    handleDone,
  )

  const displayIndex = prefersReducedMotion ? 0 : index

  return (
    <div
      role="dialog"
      aria-label="Benvenuto"
      onClick={skip}
      className={[
        'fixed inset-0 z-[60] flex items-center justify-center bg-[#020617] text-white',
        'cursor-pointer select-none',
        'transition-opacity duration-700',
        leaving ? 'opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      {/* Greeting */}
      <div aria-live="polite" className="text-center">
        <span
          key={displayIndex}
          className="intro-greeting block text-6xl sm:text-8xl font-normal"
          style={{ fontFamily: '"Dancing Script", cursive' }}
        >
          {greetings[displayIndex]}
        </span>
      </div>

      {/* Signature */}
      <p className="absolute bottom-8 right-8 text-sm tracking-wide text-white/55">
        in the mind of francois lampasona
      </p>

      {/* Skip button */}
      <button
        aria-label="Entra nel sito"
        onClick={e => { e.stopPropagation(); skip() }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-widest text-white/40 hover:text-white/70 transition-colors"
      >
        Entra ↓
      </button>
    </div>
  )
}
