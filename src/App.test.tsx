import { render, screen } from '@testing-library/react'
import App from './App'

test('mostra il nome di Francois', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: /francois lampasona/i })).toBeInTheDocument()
})
