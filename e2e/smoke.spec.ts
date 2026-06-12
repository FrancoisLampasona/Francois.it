import { test, expect } from '@playwright/test'

test('il sito carica con il titolo giusto', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Francois Lampasona/)
})

test('salta alla scrivania porta alle cartelle', async ({ page }) => {
  await page.goto('/')
  // Wait for the page to settle
  await page.waitForLoadState('networkidle')

  // The skip button is rendered by JourneyOverlay only in 3D mode.
  // Playwright chromium has WebGL via SwiftShader, so 3D path renders.
  const skipBtn = page.getByRole('button', { name: 'Salta alla scrivania' })
  await expect(skipBtn).toBeVisible({ timeout: 10_000 })
  await skipBtn.click()

  // After scrolling, the Progetti folder button should be visible in viewport
  // Use first() because name 'Progetti' now matches both desktop icon and dock item
  const progettiBtn = page.getByRole('button', { name: 'Progetti' }).first()
  await expect(progettiBtn).toBeInViewport({ timeout: 10_000 })
})

const folders = ['Progetti', 'CV', 'Link', 'Contatti'] as const

test('le cartelle aprono le finestre', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // Scroll to desk first so folder buttons are reachable
  await page.evaluate(() => {
    document.getElementById('desk')?.scrollIntoView({ behavior: 'instant' })
  })

  for (const name of folders) {
    // Use first() because name now matches both desktop icon and dock item
    const folderBtn = page.getByRole('button', { name }).first()
    await expect(folderBtn).toBeVisible({ timeout: 10_000 })
    await folderBtn.click()

    // Expect a dialog with that name
    const dialog = page.getByRole('dialog', { name })
    await expect(dialog).toBeVisible({ timeout: 5_000 })

    // Close the dialog with the Chiudi button
    await page.getByRole('button', { name: 'Chiudi' }).click()
    await expect(dialog).not.toBeVisible({ timeout: 5_000 })
  }
})

test('il CV è scaricabile', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // Scroll to desk
  await page.evaluate(() => {
    document.getElementById('desk')?.scrollIntoView({ behavior: 'instant' })
  })

  // Open CV window — use first() because name 'CV' now matches both desktop icon and dock item
  const cvBtn = page.getByRole('button', { name: 'CV' }).first()
  await expect(cvBtn).toBeVisible({ timeout: 10_000 })
  await cvBtn.click()

  // Expect the download link
  const downloadLink = page.getByRole('link', { name: 'Scarica il CV (PDF)' })
  await expect(downloadLink).toBeVisible({ timeout: 5_000 })
  await expect(downloadLink).toHaveAttribute('href', '/cv/Francois_Lampasona_CV.pdf')
  await expect(downloadLink).toHaveAttribute('download')
})

test('il toggle lingua cambia i testi', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // Click the language toggle button (aria-label "Switch to English" when Italian is active)
  const toggleBtn = page.getByRole('button', { name: /english/i })
  await expect(toggleBtn).toBeVisible({ timeout: 10_000 })
  await toggleBtn.click()

  // After switching to English, the first journey scene title should show English text
  // The text is: "A journey through the worlds I've built"
  await expect(
    page.getByText("A journey through the worlds I've built"),
  ).toBeVisible({ timeout: 5_000 })
})
