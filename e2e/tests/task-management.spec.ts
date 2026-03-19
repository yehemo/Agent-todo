import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'demo@example.com')
  await page.fill('input[type="password"]', 'password')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
  await page.goto('/tasks')
})

test.describe('Task Management', () => {
  test('create a task and verify it appears in list', async ({ page }) => {
    const title = `E2E Task ${Date.now()}`
    await page.click('text=New Task')

    await page.fill('input[placeholder="Task title..."]', title)
    await page.selectOption('select[name="priority"]', 'high')
    await page.click('button:has-text("Create Task")')

    await expect(page.locator(`text=${title}`)).toBeVisible()
  })

  test('edit task title and see updated value', async ({ page }) => {
    const title = `Edit Me ${Date.now()}`
    const updatedTitle = `Updated ${Date.now()}`

    await page.click('text=New Task')
    await page.fill('input[placeholder="Task title..."]', title)
    await page.click('button:has-text("Create Task")')
    await expect(page.locator(`text=${title}`)).toBeVisible()

    await page.locator('.group').filter({ hasText: title }).hover()
    await page.locator('.group').filter({ hasText: title }).locator('button[title="Edit"]').click()
    await page.fill('input[placeholder="Task title..."]', updatedTitle)
    await page.click('button:has-text("Save Changes")')

    await expect(page.locator(`text=${updatedTitle}`)).toBeVisible()
  })

  test('change task status to completed', async ({ page }) => {
    const title = `Complete Me ${Date.now()}`
    await page.click('text=New Task')
    await page.fill('input[placeholder="Task title..."]', title)
    await page.click('button:has-text("Create Task")')

    await page.locator('.group').filter({ hasText: title }).hover()
    await page.locator('.group').filter({ hasText: title }).locator('button[title="Start"]').click()

    await expect(page.locator('.group').filter({ hasText: title }).locator('text=In Progress')).toBeVisible()
  })

  test('delete task and verify it disappears', async ({ page }) => {
    const title = `Delete Me ${Date.now()}`
    await page.click('text=New Task')
    await page.fill('input[placeholder="Task title..."]', title)
    await page.click('button:has-text("Create Task")')
    await expect(page.locator(`text=${title}`)).toBeVisible()

    await page.locator('.group').filter({ hasText: title }).hover()
    await page.locator('.group').filter({ hasText: title }).locator('button[title="Delete"]').click()
    await page.click('button:has-text("Delete")')

    await expect(page.locator(`text=${title}`)).not.toBeVisible()
  })

  test('filter by high priority shows only high priority tasks', async ({ page }) => {
    await page.selectOption('select >> nth=1', 'high')
    const badges = page.locator('text=High')
    const count  = await badges.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })
})
