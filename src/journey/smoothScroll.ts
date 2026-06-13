import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenis: Lenis | null = null
let tickerFn: ((time: number) => void) | null = null

type ScrollRange = { start: number; length: number }

type StartOptions = {
  /** Number of scenes; enables gentle snap to the nearest one. */
  snapCount?: number
  /** Returns the journey's scroll start (px) and scrollable length (px). */
  getRange?: () => ScrollRange | null
}

/**
 * Starts Lenis smooth scrolling, wires it to GSAP's ticker and ScrollTrigger,
 * and (optionally) gently snaps to the nearest scene once the user stops.
 * Returns a cleanup function.
 */
export function startSmoothScroll(opts: StartOptions = {}): () => void {
  if (typeof window === 'undefined' || lenis) return () => {}

  const instance = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  })
  lenis = instance

  instance.on('scroll', ScrollTrigger.update)

  tickerFn = (time: number) => instance.raf(time * 1000)
  gsap.ticker.add(tickerFn)
  gsap.ticker.lagSmoothing(0)

  let snapTimer: number | undefined
  const { snapCount, getRange } = opts
  if (snapCount && snapCount > 1 && getRange) {
    instance.on('scroll', (e: { velocity: number }) => {
      if (snapTimer) window.clearTimeout(snapTimer)
      if (Math.abs(e.velocity) > 0.08) return
      snapTimer = window.setTimeout(() => {
        const range = getRange()
        if (!range || range.length <= 0) return
        const rel = (instance.scroll - range.start) / range.length
        if (rel < -0.02 || rel > 1.02) return // only within the journey
        const seg = 1 / (snapCount - 1)
        const nearest = Math.min(1, Math.max(0, Math.round(rel / seg) * seg))
        const targetScroll = range.start + nearest * range.length
        if (Math.abs(targetScroll - instance.scroll) < 2) return
        instance.scrollTo(targetScroll, {
          duration: 0.75,
          easing: (x: number) => 1 - Math.pow(1 - x, 3),
        })
      }, 130)
    })
  }

  return () => {
    if (snapTimer) window.clearTimeout(snapTimer)
    if (tickerFn) gsap.ticker.remove(tickerFn)
    instance.destroy()
    lenis = null
    tickerFn = null
  }
}

/** Smoothly scrolls to the desk section (falls back to native if Lenis is off). */
export function scrollToDesk(): void {
  const target = document.getElementById('desk')
  if (!target) return
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.1 })
  } else {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}
