// Acceptance test for dashboard display
import { test, expect } from '@playwright/test';

test('Dashboard displays welcome and recent orders', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page.locator('text=Welcome back')).toBeVisible();
  await expect(page.locator('text=Recent Orders')).toBeVisible();
});
