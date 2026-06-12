import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'
import i18n from '../i18n'

declare global {
  var localStorage: Storage
}

// Mock localStorage if not available
if (typeof globalThis !== 'undefined' && !globalThis.localStorage) {
  const store: Record<string, string> = {}
  globalThis.localStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key])
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length
    },
  } as Storage
}

beforeEach(async () => {
  localStorage.clear()
  // Skip the intro overlay in unit tests so App renders its full content
  try { sessionStorage.setItem('introSeen', '1') } catch {}
  await i18n.changeLanguage('it')
})
