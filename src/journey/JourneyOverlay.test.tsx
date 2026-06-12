import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { journeyScenes } from './scenes'
import { useJourneyStore } from './store'
import { JourneyOverlay } from './JourneyOverlay'

beforeEach(() => {
  useJourneyStore.setState({ progress: 0 })
})

test('mostra titolo e testo della scena attiva', () => {
  render(<JourneyOverlay />)
  expect(screen.getByText('Un viaggio tra i mondi che ho costruito')).toBeInTheDocument()
  expect(document.querySelector('[aria-live="polite"]')).toBeInTheDocument()
})

test('cambia testo quando il progress avanza', () => {
  render(<JourneyOverlay />)
  act(() => useJourneyStore.getState().setProgress(0.99))
  expect(screen.getByText("L'universo delle possibilità")).toBeInTheDocument()
})

test('la costellazione ha un punto per scena', () => {
  render(<JourneyOverlay />)
  const nav = screen.getByRole('navigation', { name: 'Avanzamento del viaggio' })
  expect(nav.querySelectorAll('[data-dot]')).toHaveLength(journeyScenes.length)
})

test('il bottone skip porta alla scrivania', async () => {
  const scrollIntoView = vi.fn()
  const desk = document.createElement('div')
  desk.id = 'desk'
  desk.scrollIntoView = scrollIntoView
  document.body.appendChild(desk)

  render(<JourneyOverlay />)
  await userEvent.click(screen.getByRole('button', { name: 'Salta alla scrivania' }))
  expect(scrollIntoView).toHaveBeenCalled()

  desk.remove()
})
