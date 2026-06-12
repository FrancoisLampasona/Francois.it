import { test, expect } from '@playwright/test'

test.describe('Intro "hello" multilingue', () => {
  test('mostra la schermata di benvenuto al primo caricamento', async ({ page }) => {
    // Fresh context — no introSeen in sessionStorage
    await page.goto('/')

    // The welcome overlay must be present (the greeting text itself is ephemeral,
    // so assert on the stable dialog + signature instead).
    await expect(page.getByRole('dialog', { name: 'Benvenuto' })).toBeVisible({
      timeout: 5_000,
    })
    await expect(page.getByText('in the mind of francois lampasona')).toBeVisible()
  })

  test('cliccando sul pulsante Entra si rivela il sito', async ({ page }) => {
    await page.goto('/')

    const entraBtn = page.getByRole('button', { name: 'Entra nel sito' })
    await expect(entraBtn).toBeVisible({ timeout: 5_000 })
    await entraBtn.click()

    // After the fade-out the welcome overlay should be gone and the site present.
    await expect(page.getByRole('dialog', { name: 'Benvenuto' })).toHaveCount(0, {
      timeout: 3_000,
    })
    await expect(page.locator('#desk')).toBeAttached()
  })
})
