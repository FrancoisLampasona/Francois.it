import { render, screen } from '@testing-library/react'
import App from './App'

test('mostra nome, ruolo e toggle lingua', () => {
  render(<App />)
  expect(screen.getByText('Francois Lampasona')).toBeInTheDocument()
  expect(screen.getByText('Full Stack Developer | DevOps Enthusiast')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument()
})

test('mostra il viaggio prima della scrivania', () => {
  render(<App />)
  expect(screen.getByText('Un viaggio tra i mondi che ho costruito')).toBeInTheDocument()
  // 'Progetti' now appears twice: desktop icon + dock item
  expect(screen.getAllByRole('button', { name: 'Progetti' })[0]).toBeInTheDocument()
})

test('la scrivania è raggiungibile via anchor #desk', () => {
  render(<App />)
  const desk = document.getElementById('desk')
  expect(desk).not.toBeNull()
  expect(desk!.querySelector('[aria-label="La mia scrivania"]')).not.toBeNull()
})
