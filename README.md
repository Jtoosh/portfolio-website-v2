# James's portfolio

A single-page React and TypeScript portfolio. Vite produces the browser assets and a temporary server-rendered bundle; the build inserts the portfolio HTML into `dist/index.html` before removing that temporary bundle. React hydrates the same content in the browser.

Use Node.js 22.12 or newer (an actively supported LTS release is recommended).

```sh
npm ci
npm run build
npm run preview
```

`npm run dev` provides Vite's development server. The production preview includes the build-generated reading content.

Edit `src/content.ts` to maintain personal copy, TODOs, project summaries, visibility, skill and language tags, origin, ordering, and contact destinations. The project list includes every visible repository, with room for three complete cards and scrolling for the rest. Featured projects lead the list; Education origin is independent. The explicit `skillTags` and `languageTags` catalogs control the filters; projects must match every selected tag. See [Adjusting projects, skill tags, and language tags](docs/projects.md) for a short maintenance guide. Contact destinations were retained from the historical portfolio configuration at commit `86504ad6dfdc9c94ecd63414f69ea8b07dd24f47`.

Tests observe production HTML and browser behavior:

```sh
npx playwright install chromium
npm run build
npm test
npm run typecheck
npm run format:check
```

`PORTFOLIO_TEST_PORT=4180 npm test` selects another preview port. `PLAYWRIGHT_CHANNEL=chrome npm test` uses an installed Chrome when desired. Tests do not rely on changing external services.

See `docs/project-spec.md` for the approved scope and `docs/project-copy.md` for source-backed project descriptions. Pushes to `main` automatically publish after validation.

Search and sharing copy lives in `index.html`; maintain the title and descriptions together when changing James's positioning. The canonical destination is `https://profile.jamesteuscher.click/`. `public/CNAME` travels into `dist/` with the static artifact. Vite's root-relative asset paths target that custom domain, independently of the repository name.

The **Validate portfolio** workflow checks formatting, TypeScript, the production build, and every test in `tests/` on pushes and pull requests. It installs Chromium and requires no GitHub credential or live API response for the website tests. Formatting covers application files, tests, build configuration, workflows, and this README; historical planning documents are outside that check.

The **Publish portfolio to GitHub Pages** workflow runs automatically on pushes to `main`, including merged pull requests. It validates all tests, rebuilds and uploads only `dist/`, then publishes to **profile.jamesteuscher.click**. You can also run it manually from Actions. Pull requests and pushes to other branches run validation without publishing.

In **Jtoosh/portfolio-website-v2**, Settings → Pages uses **GitHub Actions** with the custom domain **profile.jamesteuscher.click** and HTTPS. The `github-pages` environment must allow deployments from `main`; any configured environment approval rules still apply. The workflow follows [GitHub's custom Pages workflow guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
