import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { test, expect } from 'vitest'

const expectedAssets = [
  'journey/bg-decollo.webp',
  'journey/bg-origini.webp',
  'journey/bg-frontend.webp',
  'journey/bg-backend.webp',
  'journey/bg-maserati.webp',
  'journey/bg-boop.webp',
  'journey/bg-finale.webp',
  'journey/scrivania.webp',
  'journey/castello-salemi.webp',
  'journey/francois-cane.webp',
  'og.jpg',
  'favicon.png',
  'favicon-32.png',
]

for (const asset of expectedAssets) {
  test(`public/${asset} esiste`, () => {
    expect(existsSync(join(process.cwd(), 'public', asset))).toBe(true)
  })
}
