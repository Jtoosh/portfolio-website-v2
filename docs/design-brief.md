# Portfolio design brief

This brief records decisions from the portfolio design interview. James confirmed the documents accurately reflect his intent. The approved direction and completion details are consolidated in [the project spec](./project-spec.md); implementation has not started.

## Settled direction

- **Primary reader:** A potential coworker or manager.
- **Desired impression:** James learns quickly, has natural curiosity and a desire to build, and has invested—and will continue investing—time and effort in his craft.
- **Professional positioning:** Broad software engineering, supported by experience and learning in full-stack web, backend, mobile, and some infrastructure.
- **Primary next step:** Email James. LinkedIn, resume, and GitHub should also be easy to access.
- **Featured work:** Exercise App, Note of the Day (called Ambient Flashcards in its README), and Tweeter. Proposed display order follows this list.
- **Additional work:** Skill filtering can reveal Chess, Study Platform, and JWT Pizza beyond the featured projects.
- **Education label:** Applied to all coursework, including featured projects such as Tweeter. It describes project origin, not prominence or quality.
- **Current work:** A personally written "working on now" note plus three automatically updated GitHub commits, displayed on the page.
- **Current-work content:** Explain the motivation and vision behind what James is doing now. The actual note is not yet supplied.
- **Current-work placeholder:** Include a visible TODO until James writes the note.
- **Commit feed scope:** Commits authored by James in public repositories, on their default branches only, excluding automated commits.
- **Commit feed refresh:** Show cached commits immediately. Attempt a background refresh on a visit when the cache is older than one hour; retain previous results if GitHub is unavailable. Show a subtle freshness timestamp. A failed refresh must not make old data appear freshly retrieved.
- **Skills:** A compact section with clickable skill badges that display curated projects tagged with the selected skill.
- **Filtering:** Readers may select multiple skill badges. A project matches if it has any selected skill (OR matching).
- **Default project results:** With no skills selected, show the three featured projects.
- **Skill instruction:** Include a simple, subtle line beside the badges: "Click a skill to see what I've done with it" (or equivalent wording).
- **Project detail:** Short summaries on the portfolio page; readers use the GitHub repository link for further detail.
- **Exploration:** Let readers explore the content on the portfolio page as much as practical.
- **Scope:** One page.
- **Focus:** The content should receive the most attention.
- **Personal character:** Expressed primarily through James's bio/introduction and the projects he chooses to show.
- **Intro ownership:** James will manually write the final introduction. Use the proposed intro as a placeholder and include a visible TODO to replace it.
- **Visual direction:** Cool minimal, conservative, with a few deliberate flourishes.
- **Theme:** Follow the visitor's system preference. A manual toggle has not been requested.
- **Stack:** Retain React, TypeScript, and Vite because they meet the project's needs; trendy or bleeding-edge technology is not a priority.
- **Hosting:** Retain GitHub Pages and `profile.jamesteuscher.click`. Generate the main content as HTML at build time for discovery and fast initial display; React supplies the interactions.

## Introduction placeholder

Visible TODO: **TODO: Replace this introduction with my own writing.**

> I'm James, a software engineer and computer science student. I'm naturally curious, and I learn by building—across web, backend, native apps, and infrastructure. I care about steadily improving my craft and making useful things.

This copy is an explicitly requested placeholder, not approved final biography text. The TODO must be visible on the page.

## Current-work placeholder

Visible TODO: **TODO: Describe the motivation and vision behind what I'm working on now.**

James will supply the final note. Do not infer his current priorities from recent repository activity.

## Final review status

- Multiple badge selection, OR matching, the three-project default, and the skill instruction are settled. Reset and skill-coverage completion details are proposed below for the final review.
- Current-work motivation/vision, visible TODO, commit scope, one-hour cache, retained results on failure, and subtle freshness timestamp are settled. Content editing is proposed below for the final review.
- System-preference theme, React/TypeScript/Vite, GitHub Pages, and the existing domain are settled.
- James accepted these documents and requested a project spec. The completion details and project copy below are incorporated into that spec. There are no remaining substantive interview questions.

## Proposed completion details

James accepted these completion details when confirming the documents and requesting the project spec.

- **Section order:** A compact header with email and supporting links; introduction; skills; projects; current work and three recent commits; a small contact footer.
- **Project order:** Exercise App, Note of the Day, Tweeter. Filtered additional projects follow matching featured projects.
- **Reset:** Each selected badge can be deselected; a small clear control removes all selections and restores the three featured projects.
- **Skill coverage:** Interactive badges must have matching evidence in the curated project collection. Other skills can be mentioned in supporting text. Badges have visible selected states and work with a keyboard.
- **Visual treatment:** Cool neutral backgrounds, strong text contrast, one restrained blue accent, and careful typography and spacing. The system preference controls light/dark appearance. Use a text-led layout that adapts to mobile screens.
- **Content editing:** Keep intro, current-work note, project summaries, tags, and contact links in an easy-to-edit content file.
- **Project copy:** Draft summaries and source links are in [project-copy.md](./project-copy.md). James can revise them without changing the layout.
- **Discovery:** Provide a descriptive page title, description, canonical URL, and sharing metadata, with the main portfolio content in the generated HTML. These improve presentation and crawlability without promising traffic growth.
- **Feed implementation:** The accepted behavior is immediate cached display, background refresh after one hour, retained previous data on failure, and a subtle freshness timestamp. Package a genuine initial snapshot for first visits and keep successful refreshes locally. Use actual GitHub data, with no invented activity.
- **Delivery scope:** Build and verify the new site locally after shared understanding is confirmed. Hosting configuration can be prepared for GitHub Pages; publishing is a separate action unless explicitly requested.

## Source material

- Current portfolio: https://profile.jamesteuscher.click
- GitHub: https://github.com/jtoosh

## Source observations

These are observations from existing material, not decisions about the new site. The live portfolio could not be retrieved directly; its repository supplied the portfolio configuration.

- [Portfolio configuration](https://github.com/Jtoosh/portfolio-website-v2/blob/86504ad6dfdc9c94ecd63414f69ea8b07dd24f47/gitprofile.config.ts) lists Software Engineer at BYU OIT from April 2026, earlier computer support experience, and a CS degree with a math minor expected in 2027. It supplies email, LinkedIn, and a resume link, and automatically displays eight recently updated repositories.
- [Exercise app design notes](https://github.com/Jtoosh/exercise-app/blob/main/design.md) describe a personal workout use case, scope choices, and feedback from use at the gym. These offer promising evidence of motivation and iteration; proposed improvements should not be described as completed features without verification.
- [Study Platform](https://github.com/Jtoosh/byu-cs260) documents a progression through web technologies. Its educational context and James's own contributions need to be reflected in any description.
- [Ambient Flashcards](https://github.com/Jtoosh/note-of-the-day) describes an experiment in surfacing learning snippets and explicitly credits extensive Codex coding, with James prompting, reviewing, and testing. Project copy should preserve that distinction if selected.
- [JWT Pizza deployment workflow](https://github.com/Jtoosh/jwt-pizza-service/blob/main/.github/workflows/ci.yml) and [curiosity report](https://github.com/Jtoosh/jwt-pizza/blob/main/curiosityReport.md) offer an infrastructure/operations story around a course application. Its chaos incident reports describe simulations, not actual business impact.
- [Tweeter project notes](https://github.com/Jtoosh/byu-cs340/blob/main/tweeter-web-starter/notes.md) and [feed dispatch implementation](https://github.com/Jtoosh/byu-cs340/blob/main/tweeter-web-starter/tweeter-server/src/lambda/status/PostUpdateFeedMessages.ts) offer backend/cloud evidence involving AWS, queues, Terraform, and debugging. It is a course project; production scale is not established.
- [Network Chess personal notes](https://github.com/Jtoosh/byu-cs240/blob/main/notes.md) document Java, SQL, WebSockets, and concrete debugging lessons in a course project.
- [Ambient Flashcards macOS notes](https://github.com/Jtoosh/note-of-the-day/blob/main/mac-widget/README.md) document a SwiftUI/WidgetKit scaffold. This establishes a native desktop experiment, not verified mobile work. The bounded public repository review did not identify a sufficiently documented iOS/Android candidate.
- The GitHub profile's March 2026 job-search language predates the software engineering role in the portfolio configuration. It does not establish the desired positioning for the new site.
- The current portfolio uses React, TypeScript, and Vite ([package.json](https://github.com/Jtoosh/portfolio-website-v2/blob/86504ad6dfdc9c94ecd63414f69ea8b07dd24f47/package.json)). It builds static files and deploys them to GitHub Pages on pushes to main ([deploy workflow](https://github.com/Jtoosh/portfolio-website-v2/blob/86504ad6dfdc9c94ecd63414f69ea8b07dd24f47/.github/workflows/deploy.yml)), with the existing custom domain in [CNAME](https://github.com/Jtoosh/portfolio-website-v2/blob/86504ad6dfdc9c94ecd63414f69ea8b07dd24f47/CNAME). Retaining this stack and hosting is now settled.

## Hosting and discovery evaluation

Accepted direction: keep GitHub Pages and the existing domain, and generate the introduction and project summaries into HTML at build time. React can supply interactive skill filtering. This follows the small site's requirements; changing the hosting provider alone has no demonstrated benefit for viewership.

- [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) establishes static HTML/CSS/JavaScript hosting and custom domains. [HTTPS documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https) establishes HTTPS support for correctly configured custom domains.
- [Google JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) explains that Google renders JavaScript and recommends server-side rendering or prerendering. Initial HTML content, descriptive metadata, mobile performance, and useful project copy are relevant improvements; React content is not inherently unindexable.
- A host with server functions could support a centrally cached activity feed, but the accepted behavior can be served from Pages with browser retrieval and a cached fallback.
- [GitHub schedule documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule) notes that scheduled jobs can be delayed or dropped, and public repository schedules disable after 60 days of inactivity in that repository. A scheduled-build feed cannot be promised to refresh perpetually without accounting for this behavior.
- [Commit search documentation](https://docs.github.com/en/search-github/searching-on-github/searching-commits) limits search to default branches, which matches the accepted feed scope. [Events API documentation](https://docs.github.com/en/rest/activity/events) describes a bounded, delayed event history; it does not establish a comprehensive latest-commit feed.
- [REST commit search](https://docs.github.com/en/rest/search/search#search-commits) permits unauthenticated access to public results and ordering by author date. [CORS documentation](https://docs.github.com/en/rest/using-the-rest-api/using-cors-and-jsonp-to-make-cross-origin-requests) permits requests from browsers on other origins. This supports best-effort on-visit refresh without changing hosts. Unauthenticated search is rate limited and indexing may lag; a cached fallback is needed. Do not limit results to repositories James owns unless separately requested; authored contributions to other public repositories meet the accepted scope.

## Decision tree

- Reader and purpose: settled.
  - Desired next action: settled; email, with supporting LinkedIn/resume/GitHub links.
  - Professional positioning and breadth: settled; broad software engineering.
  - Evidence supporting the desired impression: selected projects and source-backed summaries ready for final review.
    - Featured project selection: settled; Exercise App, Note of the Day, and Tweeter.
    - Additional coursework selection: settled; Chess, Study Platform, JWT Pizza.
    - Project ordering: proposed in completion details.
    - Labeling coursework: settled; all coursework labeled "Education", including featured projects.
    - Project descriptions, contributions, and outcomes: source-backed drafts ready for review; short on-page summaries with GitHub links settled.
    - Presentation of skills: compact clickable badges, additional class repositories, multiple selection, OR matching, three-project default, and subtle instruction settled; reset/skill-coverage details proposed for final review.
    - Presentation of current work and GitHub activity: on-page motivation/vision note with visible TODO, three automatic commits, default-branch feed scope, one-hour refresh cache, retained previous results on failure, and subtle timestamp settled.
- Personal character and visual restraint: settled.
  - Bio content and voice: James owns final copy; proposed placeholder plus visible replacement TODO settled.
  - Visual character: cool minimal and system-preference theme settled; typography/spacing/accent treatment proposed for final review.
- Small scope: settled; one page.
  - Section structure: proposed for final review.
  - Updating content and maintenance expectations: editable content file proposed for final review.
- Delivery constraints: React/TypeScript/Vite, Pages, domain, build-time HTML, and feed freshness settled.

## Decision records

No architectural decision records are warranted yet. The settled choices so far are easy to revise.
