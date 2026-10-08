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

Search and sharing copy lives in `index.html`; maintain the title and descriptions together when changing James's positioning. The canonical destination is `https://profile.jamesteuscher.click/`. `public/CNAME` travels into `dist/` with the static artifact. Vite's root-relative asset paths target that custom domain, independently of the repository name.

The **Validate portfolio** workflow checks formatting, TypeScript, the production build, and every test in `tests/` on pushes and pull requests. It installs Chromium and requires no GitHub credential or live API response for the website tests. Formatting covers application files, tests, build configuration, workflows, and this README; historical planning documents are outside that check.

Publication requires a separate explicit approval. After that approval, in **Jtoosh/portfolio-website-v2**, confirm Settings → Pages uses **GitHub Actions** and retains the custom domain **profile.jamesteuscher.click** and HTTPS. Confirm the `github-pages` environment allows the approved branch, and optionally require a reviewer there. Then manually run **Publish portfolio to GitHub Pages (manual)** from Actions on the approved revision. That workflow validates all tests, rebuilds and uploads only `dist/`, then publishes it. Pushes and pull requests only validate; they do not publish. No DNS change is part of this preparation.

The prepared workflow follows [GitHub's custom Pages workflow guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). The live website has not been published by this implementation.
