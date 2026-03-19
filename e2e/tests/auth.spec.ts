import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('register a new user and redirect to dashboard', async ({ page }) => {
    const unique = Date.now()
    await page.goto('/register')

    await page.fill('input[placeholder="Jane Doe"]', 'Test User')
    await page.fill('input[type="email"]', `user${unique}@example.com`)
    await page.fill('input[placeholder="Min 8 characters"]', 'password123')
    await page.fill('input[placeholder="••••••••"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
  })

  test('login with valid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[type="email"]', 'demo@example.com')
    await page.fill('input[type="password"]', 'password')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('logout redirects to login page', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'demo@example.com')
    await page.fill('input[type="password"]', 'password')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')

    await page.click('text=Sign out')
    await expect(page).toHaveURL('/login')
  })

  test('accessing dashboard without login redirects to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('accessing login when authenticated redirects to dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'demo@example.com')
    await page.fill('input[type="password"]', 'password')
    await page.click('button[type="submit"]')

    await page.goto('/login')
    await expect(page).toHaveURL('/dashboard')
  })
})
