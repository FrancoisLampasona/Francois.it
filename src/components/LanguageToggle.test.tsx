import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import i18n from '../i18n'
import { LanguageToggle } from './LanguageToggle'

test('mostra EN quando la lingua è italiano e cambia lingua al click', async () => {
  render(<LanguageToggle />)
  const button = screen.getByRole('button', { name: /english/i })
  expect(button).toHaveTextContent('EN')
  await userEvent.click(button)
  expect(i18n.language).toBe('en')
  expect(localStorage.getItem('lang')).toBe('en')
  expect(screen.getByRole('button', { name: /italiano/i })).toHaveTextContent('IT')
})
