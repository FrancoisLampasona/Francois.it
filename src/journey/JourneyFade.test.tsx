import { act, render } from '@testing-library/react'
import { useJourneyStore } from './store'
import { JourneyFade } from './JourneyFade'

beforeEach(() => {
  useJourneyStore.setState({ progress: 0 })
})

test('opacity è 0 a progress 0.5 (sotto la soglia)', () => {
  const { container } = render(<JourneyFade />)
  act(() => useJourneyStore.getState().setProgress(0.5))
  const el = container.querySelector('[data-fade]') as HTMLElement
  expect(Number(el.style.opacity)).toBe(0)
})

test('opacity è 0 esattamente a progress 0.92 (soglia)', () => {
  const { container } = render(<JourneyFade />)
  act(() => useJourneyStore.getState().setProgress(0.92))
  const el = container.querySelector('[data-fade]') as HTMLElement
  expect(Number(el.style.opacity)).toBeCloseTo(0, 5)
})

test('opacity è circa 0.5 a progress 0.96 (metà dell\'intervallo)', () => {
  const { container } = render(<JourneyFade />)
  act(() => useJourneyStore.getState().setProgress(0.96))
  const el = container.querySelector('[data-fade]') as HTMLElement
  expect(Number(el.style.opacity)).toBeCloseTo(0.5, 5)
})

test('opacity è 1 a progress 1 (fine viaggio)', () => {
  const { container } = render(<JourneyFade />)
  act(() => useJourneyStore.getState().setProgress(1))
  const el = container.querySelector('[data-fade]') as HTMLElement
  expect(Number(el.style.opacity)).toBeCloseTo(1, 5)
})
