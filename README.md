# James's portfolio

A single-page React and TypeScript portfolio. Vite produces the browser assets and a temporary server-rendered bundle; the build inserts the portfolio HTML into `dist/index.html` before removing that temporary bundle. React hydrates the same content in the browser.

Use Node.js 22.12 or newer (an actively supported LTS release is recommended).

```sh
npm ci
npm run build
npm run preview
```

`npm run dev` provides Vite's development server. The production preview includes the build-generated reading content.

Edit `src/content.ts` to maintain personal copy, TODOs, project summaries, skill tags, origin, ordering, and contact destinations. Project identity, featured status, and Education origin are independent. Contact destinations were retained from the historical portfolio configuration at commit `86504ad6dfdc9c94ecd63414f69ea8b07dd24f47`.

Tests observe production HTML and browser behavior:

```sh
npx playwright install chromium
npm run build
npm test
npm run typecheck
npm run format:check
```

`PORTFOLIO_TEST_PORT=4180 npm test` selects another preview port. `PLAYWRIGHT_CHANNEL=chrome npm test` uses an installed Chrome when desired. Tests do not rely on changing external services.

See `docs/project-spec.md` for the approved scope and `docs/project-copy.md` for source-backed project descriptions. Publishing is a separate action.
