import { test, expect } from '@playwright/test';

// Minimal placeholder e2e to keep pipeline green while UI evolves
test('app loads root page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/$/);
});
