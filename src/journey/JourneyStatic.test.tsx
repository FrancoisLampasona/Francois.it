import { render, screen } from '@testing-library/react'
import { journeyScenes } from './scenes'
import { JourneyStatic } from './JourneyStatic'

test('mostra tutte le scene come sezioni testuali', () => {
  render(<JourneyStatic />)
  expect(screen.getByText('Un viaggio tra i mondi che ho costruito')).toBeInTheDocument()
  expect(screen.getByText('Il pianeta delle Competenze')).toBeInTheDocument()
  expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(journeyScenes.length)
})
