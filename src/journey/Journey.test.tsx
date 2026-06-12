import { render, screen } from '@testing-library/react'
import { journeyScenes } from './scenes'
import { Journey } from './Journey'

test('in ambiente senza WebGL mostra il fallback statico con tutte le scene', () => {
  render(<Journey />)
  expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(journeyScenes.length)
  expect(screen.getByText('Un viaggio tra i mondi che ho costruito')).toBeInTheDocument()
})
