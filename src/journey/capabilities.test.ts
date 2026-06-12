import { afterEach, vi } from 'vitest'
import { isWebGLSupported, prefersReducedMotion } from './capabilities'

afterEach(() => {
  vi.unstubAllGlobals()
})

test('in jsdom WebGL non è supportato', () => {
  expect(isWebGLSupported()).toBe(false)
})

test('prefersReducedMotion è false senza matchMedia', () => {
  expect(prefersReducedMotion()).toBe(false)
})

test('prefersReducedMotion legge matchMedia quando presente', () => {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
  expect(prefersReducedMotion()).toBe(true)
})
