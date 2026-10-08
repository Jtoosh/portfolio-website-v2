import { defineConfig } from "@playwright/test";

const port = Number(process.env.PORTFOLIO_TEST_PORT || 4173);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL,
    ...(process.env.PLAYWRIGHT_CHANNEL
      ? { channel: process.env.PLAYWRIGHT_CHANNEL }
      : {}),
  },
  webServer: {
    command: `npm run preview -- --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
