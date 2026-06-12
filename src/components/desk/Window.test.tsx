import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { Window } from './Window'

test('mostra titolo tradotto e contenuto', () => {
  render(
    <Window titleKey="desk.projects" onClose={() => {}}>
      <p>contenuto finestra</p>
    </Window>,
  )
  expect(screen.getByRole('dialog', { name: 'Progetti' })).toBeInTheDocument()
  expect(screen.getByText('contenuto finestra')).toBeInTheDocument()
})

test('chiude con il bottone di chiusura', async () => {
  const onClose = vi.fn()
  render(
    <Window titleKey="desk.projects" onClose={onClose}>
      <p>x</p>
    </Window>,
  )
  await userEvent.click(screen.getByRole('button', { name: 'Chiudi' }))
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('chiude con il tasto Escape', async () => {
  const onClose = vi.fn()
  render(
    <Window titleKey="desk.projects" onClose={onClose}>
      <p>x</p>
    </Window>,
  )
  await userEvent.keyboard('{Escape}')
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('chiude cliccando il backdrop ma non cliccando dentro il pannello', async () => {
  const onClose = vi.fn()
  render(
    <Window titleKey="desk.projects" onClose={onClose}>
      <p>contenuto</p>
    </Window>,
  )
  await userEvent.click(screen.getByText('contenuto'))
  expect(onClose).not.toHaveBeenCalled()
  await userEvent.click(screen.getByRole('dialog').parentElement!)
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('blocca lo scroll della pagina mentre è aperta', () => {
  const { unmount } = render(
    <Window titleKey="desk.projects" onClose={() => {}}>
      <p>x</p>
    </Window>,
  )
  expect(document.body.style.overflow).toBe('hidden')
  unmount()
  expect(document.body.style.overflow).toBe('')
})

test('il focus resta dentro la finestra premendo Tab', async () => {
  render(
    <Window titleKey="desk.projects" onClose={() => {}}>
      <button>uno</button>
      <button>due</button>
    </Window>,
  )
  const dialog = screen.getByRole('dialog')
  await userEvent.tab()
  await userEvent.tab()
  await userEvent.tab()
  await userEvent.tab()
  expect(dialog.contains(document.activeElement)).toBe(true)
})
