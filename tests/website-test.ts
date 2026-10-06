import { test as base, expect } from "@playwright/test";

// Ordinary startup checks use a fresh snapshot and never contact live GitHub.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.clock.install({ time: new Date("2026-10-06T18:00:00Z") });
    await page.route("https://api.github.com/**", (route) =>
      route.fulfill({
        json: { total_count: 0, incomplete_results: false, items: [] },
      }),
    );
    await use(page);
  },
});
export { expect };
