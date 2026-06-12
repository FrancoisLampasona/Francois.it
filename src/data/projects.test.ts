import { describe, test, expect } from 'vitest'
import i18n from '../i18n'
import { projects } from './projects'

describe('projects', () => {
  test('ogni progetto ha id univoco', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('ogni chiave i18n dei progetti esiste in entrambe le lingue', () => {
    for (const p of projects) {
      for (const lng of ['it', 'en'] as const) {
        expect(i18n.exists(p.titleKey, { lng }), `${p.titleKey} (${lng})`).toBe(true)
        expect(i18n.exists(p.descKey, { lng }), `${p.descKey} (${lng})`).toBe(true)
      }
    }
  })
})
