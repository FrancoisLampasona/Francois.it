import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { test, expect } from 'vitest'
import { profile } from './profile'

test('cvUrl punta a un file esistente in public/', () => {
  expect(existsSync(join(process.cwd(), 'public', profile.cvUrl))).toBe(true)
})
