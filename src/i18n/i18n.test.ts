import { describe, test, expect } from 'vitest'
import i18n from './index'

describe('i18n', () => {
  test('traduce in italiano di default nei test', () => {
    expect(i18n.t('desk.projects')).toBe('Progetti')
  })

  test('cambia lingua in inglese', async () => {
    await i18n.changeLanguage('en')
    expect(i18n.t('desk.projects')).toBe('Projects')
  })

  test('persiste la lingua scelta in localStorage', async () => {
    await i18n.changeLanguage('en')
    expect(localStorage.getItem('lang')).toBe('en')
  })
})
