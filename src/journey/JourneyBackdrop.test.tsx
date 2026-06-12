import { act, render, screen } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'
import { journeyScenes } from './scenes'
import { useJourneyStore } from './store'
import { JourneyBackdrop } from './JourneyBackdrop'

beforeEach(() => {
  useJourneyStore.setState({ progress: 0 })
})

test('renderizza 7 immagini backdrop', () => {
  render(<JourneyBackdrop />)
  const imgs = journeyScenes.map((s) => screen.getByTestId(`backdrop-${s.id}`))
  expect(imgs).toHaveLength(7)
})

test('a progress 0 il backdrop decollo è opaco e gli altri sono trasparenti', () => {
  useJourneyStore.setState({ progress: 0 })
  render(<JourneyBackdrop />)
  const decolloImg = screen.getByTestId('backdrop-decollo')
  expect(decolloImg.className).toContain('opacity-100')
  for (const scene of journeyScenes.slice(1)) {
    const img = screen.getByTestId(`backdrop-${scene.id}`)
    expect(img.className).toContain('opacity-0')
  }
})

test('a progress 0.99 il backdrop finale è opaco', () => {
  render(<JourneyBackdrop />)
  act(() => {
    useJourneyStore.getState().setProgress(0.99)
  })
  const finaleImg = screen.getByTestId('backdrop-finale')
  expect(finaleImg.className).toContain('opacity-100')
  for (const scene of journeyScenes.slice(0, -1)) {
    const img = screen.getByTestId(`backdrop-${scene.id}`)
    expect(img.className).toContain('opacity-0')
  }
})
