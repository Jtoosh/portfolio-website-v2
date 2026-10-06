import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: process.env.PORTFOLIO_ACTIVITY_SNAPSHOT
      ? {
          "./activity-snapshot.json": resolve(
            process.env.PORTFOLIO_ACTIVITY_SNAPSHOT,
          ),
        }
      : {},
  },
});
