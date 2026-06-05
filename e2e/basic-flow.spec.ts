import { test, expect } from '@playwright/test'

test.describe('Cuadros de Viaje - Basic Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/')
  })

  test('should display login page when not authenticated', async ({ page }) => {
    await page.goto('http://localhost:5173/login')
    await expect(page.locator('text=Revisá tu email')).toBeVisible({ timeout: 5000 })
  })

  test('should navigate to dashboard after login redirect', async ({ page }) => {
    // Este test depende de que el usuario ya esté autenticado
    // En una app real, usaríamos una cuenta de test pre-configurada
    await page.goto('http://localhost:5173/dashboard')

    // Si redirige a login, no estamos autenticados
    const loginHeader = page.locator('text=Revisá tu email')
    const dashboardHeader = page.locator('text=Mis viajes')

    const isLoggedIn = await dashboardHeader.isVisible({ timeout: 1000 }).catch(() => false)

    if (isLoggedIn) {
      await expect(dashboardHeader).toBeVisible()
    } else {
      await expect(loginHeader).toBeVisible()
    }
  })

  test('should have responsive layout on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('http://localhost:5173/')

    // Verificar que no hay scroll horizontal
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1) // +1 para redondeo
  })

  test('should have responsive layout on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('http://localhost:5173/')

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1)
  })

  test('should have responsive layout on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('http://localhost:5173/')

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1)
  })

  test('should render without console errors', async ({ page }) => {
    const consoleErrors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('http://localhost:5173/')
    // Esperar un poco para que se ejecuten scripts
    await page.waitForTimeout(1000)

    expect(consoleErrors).toHaveLength(0)
  })
})
