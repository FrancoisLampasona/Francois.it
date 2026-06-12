import { journeyScenes } from './scenes'
import { sceneIndexForProgress, useJourneyStore } from './store'

beforeEach(() => {
  useJourneyStore.setState({ progress: 0, journeyVisible: true })
})

test('setProgress clampa tra 0 e 1', () => {
  useJourneyStore.getState().setProgress(-0.5)
  expect(useJourneyStore.getState().progress).toBe(0)
  useJourneyStore.getState().setProgress(1.7)
  expect(useJourneyStore.getState().progress).toBe(1)
  useJourneyStore.getState().setProgress(0.42)
  expect(useJourneyStore.getState().progress).toBe(0.42)
})

test('sceneIndexForProgress copre i confini', () => {
  const n = journeyScenes.length
  expect(sceneIndexForProgress(0)).toBe(0)
  expect(sceneIndexForProgress(1)).toBe(n - 1)
  expect(sceneIndexForProgress(0.5)).toBe(Math.min(n - 1, Math.floor(0.5 * n)))
  expect(sceneIndexForProgress(-1)).toBe(0)
  expect(sceneIndexForProgress(2)).toBe(n - 1)
})

test('journeyVisible è true per default e setJourneyVisible lo commuta', () => {
  expect(useJourneyStore.getState().journeyVisible).toBe(true)
  useJourneyStore.getState().setJourneyVisible(false)
  expect(useJourneyStore.getState().journeyVisible).toBe(false)
  useJourneyStore.getState().setJourneyVisible(true)
  expect(useJourneyStore.getState().journeyVisible).toBe(true)
})
