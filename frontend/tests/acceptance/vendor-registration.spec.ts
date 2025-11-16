// Acceptance test for vendor registration flow using Playwright
import { test, expect } from '@playwright/test';

test('Vendor registration flow', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  // Click the Register New Vendor button in the dashboard header
  await page.click('button.header-register-btn');
  // Fill the registration form
  await page.fill('input[name="name"]', 'Test Vendor');
  await page.fill('input[name="owner_name"]', 'Test Owner');
  await page.fill('input[name="email"]', 'testvendor@example.com');
  await page.fill('input[name="phone"]', '+351 912 345 678');
  await page.fill('input[name="country"]', 'Portugal');
  await page.fill('input[name="tax_id"]', '123456789');
  await page.fill('input[name="website"]', 'https://testvendor.com');
  await page.fill('textarea[name="about"]', 'We sell artisan products.');
  // Fill all verification questions (minimum 10 chars)
  const questions = await page.$$('textarea.register-textarea');
  for (let i = 0; i < questions.length; i++) {
    await questions[i].fill('This is a valid answer for question ' + (i + 1));
  }
  await page.click('button[type="submit"]');
  // Check for registration success message
  await expect(page.locator('.register-success-title')).toBeVisible();
});
