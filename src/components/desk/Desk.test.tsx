import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Desk } from './Desk'

test('mostra le quattro cartelle nel desktop', () => {
  render(<Desk />)
  for (const name of ['Progetti', 'CV', 'Link', 'Contatti']) {
    // Each name now appears twice: desktop icon + dock item
    expect(screen.getAllByRole('button', { name })).toHaveLength(2)
  }
})

test('il dock ha 4 pulsanti', () => {
  render(<Desk />)
  const dock = screen.getByRole('navigation', { name: 'Dock' })
  expect(within(dock).getAllByRole('button')).toHaveLength(4)
})

test('cliccando un pulsante del dock apre la finestra corrispondente', async () => {
  render(<Desk />)
  const dock = screen.getByRole('navigation', { name: 'Dock' })
  const dockProgetti = within(dock).getByRole('button', { name: 'Progetti' })
  await userEvent.click(dockProgetti)
  expect(screen.getByRole('dialog', { name: 'Progetti' })).toBeInTheDocument()
})

test('apre e chiude la finestra Progetti', async () => {
  render(<Desk />)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  await userEvent.click(screen.getAllByRole('button', { name: 'Progetti' })[0])
  expect(screen.getByRole('dialog', { name: 'Progetti' })).toBeInTheDocument()
  expect(screen.getByText('App gestionale palestra')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Chiudi' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('apre una sola finestra alla volta', async () => {
  render(<Desk />)
  await userEvent.click(screen.getAllByRole('button', { name: 'Contatti' })[0])
  expect(screen.getAllByRole('dialog')).toHaveLength(1)
  expect(screen.getByRole('dialog', { name: 'Contatti' })).toBeInTheDocument()
  await userEvent.click(screen.getAllByRole('button', { name: 'Progetti' })[0])
  expect(screen.getAllByRole('dialog')).toHaveLength(1)
  expect(screen.getByRole('dialog', { name: 'Progetti' })).toBeInTheDocument()
})

test('al termine il focus torna alla cartella che ha aperto la finestra', async () => {
  render(<Desk />)
  // Use the first match — the desktop icon (not the dock item)
  const folder = screen.getAllByRole('button', { name: 'Progetti' })[0]
  await userEvent.click(folder)
  await userEvent.click(screen.getByRole('button', { name: 'Chiudi' }))
  expect(folder).toHaveFocus()
})
