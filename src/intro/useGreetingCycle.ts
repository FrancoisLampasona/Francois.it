import { useEffect, useRef, useState } from 'react'

/**
 * Cycles through `count` indices (0 … count-1) every `intervalMs`.
 * When the last index has been shown, calls `onDone()` and stops.
 * Returns the current index.
 */
export function useGreetingCycle(
  count: number,
  intervalMs: number,
  onDone: () => void,
): number {
  const [index, setIndex] = useState(0)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (count <= 0) return

    const id = setInterval(() => {
      setIndex(prev => {
        const next = prev + 1
        if (next >= count) {
          clearInterval(id)
          onDoneRef.current()
          return prev // stay on last greeting
        }
        return next
      })
    }, intervalMs)

    return () => clearInterval(id)
  }, [count, intervalMs])

  return index
}
