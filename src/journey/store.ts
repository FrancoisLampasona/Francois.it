import { create } from 'zustand'
import { journeyScenes } from './scenes'

type JourneyState = {
  progress: number
  setProgress: (p: number) => void
}

export const useJourneyStore = create<JourneyState>((set) => ({
  progress: 0,
  setProgress: (p) => set({ progress: Math.min(1, Math.max(0, p)) }),
}))

export function sceneIndexForProgress(
  progress: number,
  count: number = journeyScenes.length,
): number {
  if (count <= 0) return 0
  const clamped = Math.min(1, Math.max(0, progress))
  return Math.min(count - 1, Math.floor(clamped * count))
}
