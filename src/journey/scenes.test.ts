import i18n from '../i18n'
import { journeyScenes } from './scenes'

test('ci sono 7 scene con id univoci', () => {
  expect(journeyScenes).toHaveLength(7)
  expect(new Set(journeyScenes.map((s) => s.id)).size).toBe(7)
})

test('ogni scena ha chiavi i18n esistenti in entrambe le lingue', () => {
  for (const s of journeyScenes) {
    for (const lng of ['it', 'en'] as const) {
      expect(i18n.exists(s.titleKey, { lng }), `${s.titleKey} (${lng})`).toBe(true)
      expect(i18n.exists(s.textKey, { lng }), `${s.textKey} (${lng})`).toBe(true)
    }
  }
})

test('le coordinate sono numeri finiti', () => {
  for (const s of journeyScenes) {
    for (const n of s.cameraPos) expect(Number.isFinite(n)).toBe(true)
    if (s.planet) {
      for (const n of s.planet.position) expect(Number.isFinite(n)).toBe(true)
      expect(s.planet.radius).toBeGreaterThan(0)
    }
  }
})

test('le scene dei capitoli hanno un pianeta', () => {
  const withPlanet = journeyScenes.filter((s) => s.planet)
  expect(withPlanet.length).toBeGreaterThanOrEqual(6)
})
