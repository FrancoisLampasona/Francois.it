import { test, expect } from '@playwright/test'

test.describe('Intro "hello" multilingue', () => {
  test('mostra "Ciao" al primo caricamento', async ({ page }) => {
    // Fresh context — no introSeen in sessionStorage
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // The first greeting must be visible
    await expect(page.getByText('Ciao')).toBeVisible({ timeout: 5_000 })
  })

  test('cliccando sul pulsante Entra si rivela il sito', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // The intro overlay should be present
    await expect(page.getByText('Ciao')).toBeVisible({ timeout: 5_000 })

    // Click the "Entra nel sito" skip button
    const entraBtn = page.getByRole('button', { name: 'Entra nel sito' })
    await expect(entraBtn).toBeVisible({ timeout: 5_000 })
    await entraBtn.click()

    // After the 700ms fade-out, the intro should be gone and the site should be visible
    // Wait for the #desk element to exist (it's always in the DOM once App renders)
    await expect(page.locator('#desk')).toBeAttached({ timeout: 3_000 })

    // The "Salta alla scrivania" button from JourneyOverlay (3D path) should be reachable
    // OR the overlay role=dialog should no longer be visible
    const introDialog = page.getByRole('dialog', { name: 'Benvenuto' })
    await expect(introDialog).not.toBeVisible({ timeout: 2_000 })
  })
})
