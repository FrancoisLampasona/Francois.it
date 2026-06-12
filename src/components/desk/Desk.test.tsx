import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Desk } from './Desk'

test('mostra le quattro cartelle', () => {
  render(<Desk />)
  for (const name of ['Progetti', 'CV', 'Link', 'Contatti']) {
    expect(screen.getByRole('button', { name })).toBeInTheDocument()
  }
})

test('apre e chiude la finestra Progetti', async () => {
  render(<Desk />)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Progetti' }))
  expect(screen.getByRole('dialog', { name: 'Progetti' })).toBeInTheDocument()
  expect(screen.getByText('App gestionale palestra')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Chiudi' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('apre una sola finestra alla volta', async () => {
  render(<Desk />)
  await userEvent.click(screen.getByRole('button', { name: 'Contatti' }))
  expect(screen.getAllByRole('dialog')).toHaveLength(1)
  expect(screen.getByRole('dialog', { name: 'Contatti' })).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Progetti' }))
  expect(screen.getAllByRole('dialog')).toHaveLength(1)
  expect(screen.getByRole('dialog', { name: 'Progetti' })).toBeInTheDocument()
})

test('al termine il focus torna alla cartella che ha aperto la finestra', async () => {
  render(<Desk />)
  const folder = screen.getByRole('button', { name: 'Progetti' })
  await userEvent.click(folder)
  await userEvent.click(screen.getByRole('button', { name: 'Chiudi' }))
  expect(folder).toHaveFocus()
})
