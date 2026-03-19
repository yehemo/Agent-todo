import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'demo@example.com')
  await page.fill('input[type="password"]', 'password')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})

test.describe('Categories', () => {
  test('create a category with a color', async ({ page }) => {
    const name = `Category ${Date.now()}`
    await page.goto('/categories')
    await page.click('text=New Category')

    await page.fill('input[placeholder="Category name..."]', name)
    await page.locator('button[style*="background-color: rgb(244, 63, 94)"]').click()
    await page.click('button:has-text("Create Category")')

    await expect(page.locator(`text=${name}`)).toBeVisible()
  })

  test('create task assigned to category and filter by it', async ({ page }) => {
    const catName  = `FilterCat ${Date.now()}`
    const taskName = `CatTask ${Date.now()}`

    await page.goto('/categories')
    await page.click('text=New Category')
    await page.fill('input[placeholder="Category name..."]', catName)
    await page.click('button:has-text("Create Category")')

    await page.goto('/tasks')
    await page.click('text=New Task')
    await page.fill('input[placeholder="Task title..."]', taskName)
    await page.selectOption('select[name="category_id"]', { label: catName })
    await page.click('button:has-text("Create Task")')

    await page.locator('nav').locator(`text=${catName}`).click()
    await expect(page.locator(`text=${taskName}`)).toBeVisible()
  })
})
