import { describe, test, expect } from 'vitest'
import it from './it.json'
import en from './en.json'

function keyPaths(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const path = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object') return keyPaths(v as Record<string, unknown>, path)
    return [path]
  })
}

describe('i18n parity', () => {
  test('it.json e en.json hanno esattamente le stesse chiavi', () => {
    expect(keyPaths(it).sort()).toEqual(keyPaths(en).sort())
  })

  test('nessun valore vuoto nei dizionari', () => {
    for (const dict of [it, en]) {
      for (const path of keyPaths(dict)) {
        const value = path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], dict)
        expect(value, path).not.toBe('')
      }
    }
  })
})
