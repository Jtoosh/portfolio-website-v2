# Compact skill and language filters

James selected layout **E** from the local exploration for [issue #17](https://github.com/Jtoosh/portfolio-website-v2/issues/17), then authorized its implementation on 2026-11-11.

The portfolio now uses separate Skills and Languages dropdowns with Select-style triggers, floating option panels, rotating chevrons, and animated selection marks. Selected tags remain visible below the controls for individual removal, and Reset clears both groups. A project must still match every selected skill and language.

Panels fade over 180ms and slide/scale over 220ms on entry and exit. Native auto popovers supply outside dismissal and keep one group open at a time. Arrow keys, Home/End, Enter/Space, Tab, and Escape support keyboard use. Removing a selected tag restores focus to its group's trigger. Panel placement accounts for viewport edges and updates on resize or scroll. Reduced-motion settings remove the longer transitions; colors follow the system theme.

The production components are [ProjectFilters](../../src/ProjectFilters.tsx), [TagFilter](../../src/TagFilter.tsx), and [filter styles](../../src/ProjectFilters.css). They use the existing React/CSS stack without additional dependencies. The main page has no prototype switcher, variant routing, or diagnostic display. Native popovers keep tag choices available in the generated HTML even without JavaScript; filtering is supplied by React after hydration.

## Exploration archive

The original layouts A–G, research notes, measurements and screenshots are preserved on the local throwaway branch **`prototype/tag-filter-layouts`**, commit **`1e805c87b380`**. The archive contains the complete `src/TagFilter.prototype.tsx`, `src/TagFilter.motion.prototype.tsx`, their styles, and the original `docs/investigations/` artifacts.

The archive records the question and verdict: separate compact Select-style dropdowns with smooth animation are the preferred direction. It remains a local primary source; no PR or deployment was created for the exploration.

Inspect the archived prototype without switching branches:

```sh
git show prototype/tag-filter-layouts:src/TagFilter.motion.prototype.tsx
```

To run it later, use a checkout of that branch and `npm run prototype:tags`. The implementation branch uses the regular `npm run dev` command.

## Implementation validation

The production build (including TypeScript), formatting, and all 51 Playwright browser tests passed. Existing filtering, activity, static HTML and delivery checks remain covered; new checks exercise dropdown keyboard navigation, one open group, focus restoration after chip removal, viewport placement, reduced motion, and theme inheritance. An additional Chromium animation check confirmed both entry transitions and a visible exit before the panel becomes hidden.
