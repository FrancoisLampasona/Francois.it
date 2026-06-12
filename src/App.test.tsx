import { render, screen } from '@testing-library/react'
import App from './App'

test('mostra nome, ruolo e toggle lingua', () => {
  render(<App />)
  expect(screen.getByText('Francois Lampasona')).toBeInTheDocument()
  expect(screen.getByText('Full Stack Developer | DevOps Enthusiast')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument()
})

test('mostra la scrivania con le cartelle', () => {
  render(<App />)
  expect(screen.getByRole('button', { name: 'Progetti' })).toBeInTheDocument()
})
