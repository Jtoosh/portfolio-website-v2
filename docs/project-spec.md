# Personal portfolio update

## Problem Statement

James needs a small, personal portfolio that helps a potential coworker or manager understand his ability to learn quickly, natural curiosity, desire to build, and continued investment in his craft. The website should present him as a broadly capable software engineer with experience and learning across full-stack web, backend, native/mobile applications, and some infrastructure.

The portfolio needs to emphasize selected work and clear writing, remain easy to maintain, and provide an obvious way to contact James. It should communicate ongoing effort without turning into a large repository directory or making the website's design the primary attraction. Discovery and effective presentation matter more than adopting fashionable technology.

## Solution

Build a single-page portfolio with cool minimal styling that follows the visitor's system theme. Introduce James, present a compact interactive skills section, feature three projects, and include a short Current work note followed by three recent public commits. Make email the primary contact action, with resume, LinkedIn, and GitHub links readily accessible.

Show Exercise App, Note of the Day, and Tweeter by default. Selecting Skill tags reveals matching Featured projects and Additional projects using any-match semantics. Additional projects are Network Chess, Study Platform, and JWT Pizza. Apply the Education label to every course-origin project, including featured coursework such as Tweeter.

Use brief on-page project summaries and repository links for deeper reading. Keep the introduction and Current work note editable, initially displaying the approved introduction placeholder and visible replacement TODOs. Serve the main content as build-generated HTML on GitHub Pages at the existing domain, with React providing interactive behavior.

## User Stories

1. As an Intended reader, I want to understand James's professional identity quickly, so that I can assess whether he could be a useful teammate.
2. As an Intended reader, I want to see evidence of James's curiosity, so that I can understand what motivates him to learn and build.
3. As an Intended reader, I want to see evidence of continued effort, so that I can assess his investment in his craft.
4. As an Intended reader, I want to understand James's breadth across software engineering, so that I can picture him contributing to different kinds of work.
5. As a visitor, I want to explore a small single-page portfolio, so that I can understand the important content without navigating multiple pages.
6. As a visitor, I want the design to keep my attention on the content, so that I can focus on James and his work.
7. As a visitor, I want a concise introduction in James's voice, so that the portfolio feels personal.
8. As James, I want the approved introduction placeholder to remain available initially, so that the site can be built before I finish my own writing.
9. As James, I want a visible TODO beside the introduction, so that I can readily identify the copy I need to replace.
10. As a visitor, I want to see Exercise App as a Featured project, so that I can understand a tool motivated by James's own needs.
11. As a visitor, I want to see Note of the Day as a Featured project, so that I can understand James's experiment in everyday learning tools.
12. As a visitor, I want to see Tweeter as a Featured project, so that I can understand his backend and cloud work.
13. As a visitor, I want three Featured projects displayed when no skills are selected, so that the initial view remains curated and compact.
14. As a visitor, I want short project summaries, so that I can compare the work without reading lengthy case studies.
15. As a visitor, I want a repository link for each project, so that I can examine implementation details when interested.
16. As an Intended reader, I want project descriptions to reflect James's actual contributions, so that I can assess his abilities accurately.
17. As an Intended reader, I want the Education label on all coursework, so that I can understand a project's origin.
18. As an Intended reader, I want featured coursework to retain the Education label, so that prominence does not obscure its educational context.
19. As a visitor, I want a compact skills section, so that I can scan James's technical experience.
20. As a visitor, I want an instruction beside the Skill tags, so that I understand that the badges help me explore project evidence.
21. As a visitor, I want to select a Skill tag, so that I can see what James has done with that skill.
22. As a visitor, I want to select several Skill tags, so that I can explore multiple areas of interest together.
23. As a visitor, I want projects matching any selected Skill tag, so that selecting more skills broadens the results.
24. As a visitor, I want visible selected states on badges, so that I can understand the current filter.
25. As a visitor, I want to deselect an individual badge, so that I can refine the results without starting over.
26. As a visitor, I want a simple way to clear all selected skills, so that I can return to the three Featured projects.
27. As a visitor, I want matching Featured projects shown before matching Additional projects, so that the curated emphasis remains clear.
28. As a visitor, I want Network Chess available through skill filtering, so that I can explore Java, persistence, and networking evidence.
29. As a visitor, I want Study Platform available through skill filtering, so that I can explore James's web-development learning.
30. As a visitor, I want JWT Pizza available through skill filtering, so that I can explore deployment and operations evidence.
31. As a visitor, I want filtering to happen on the portfolio page, so that I can keep exploring without navigating away.
32. As a keyboard user, I want to operate the Skill tags and reset control, so that I can use the same discovery features as other visitors.
33. As an assistive-technology user, I want meaningful headings, control names, and selected states, so that I can understand and navigate the page.
34. As a mobile visitor, I want readable text and usable controls, so that I can explore the portfolio on a small screen.
35. As a visitor, I want the website to follow my system's light or dark preference, so that its appearance fits my reading environment.
36. As a visitor, I want restrained visual flourishes and strong text contrast, so that the site has character while remaining easy to read.
37. As an Intended reader, I want a Current work note explaining James's motivation and vision, so that I can understand where his curiosity is taking him.
38. As James, I want a visible TODO for the Current work note, so that I can write that motivation and vision myself.
39. As a visitor, I want three recent commits alongside Current work, so that I can see supporting evidence of ongoing activity.
40. As a visitor, I want the feed restricted to commits authored by James in public repositories, so that it represents his visible contributions.
41. As a visitor, I want default-branch commits rather than activity from every branch, so that the feed emphasizes integrated changes.
42. As a visitor, I want automated commits excluded, so that routine automation does not dominate the activity evidence.
43. As a visitor, I want commit messages, repository names, and dates, so that the activity has useful context.
44. As a visitor, I want cached commits displayed immediately, so that GitHub response time does not delay the content.
45. As a returning visitor, I want commits refreshed when the cache is older than one hour, so that the feed stays reasonably current without unnecessary requests.
46. As a visitor, I want previous commits retained when GitHub is unavailable, so that the activity section remains useful during interruptions.
47. As a visitor, I want a subtle freshness timestamp, so that I can judge how recently the feed was successfully retrieved.
48. As a visitor, I want the timestamp to remain unchanged after a failed refresh, so that stale data is not presented as freshly checked.
49. As an Intended reader, I want an obvious email action, so that I can contact James after reviewing his work.
50. As an Intended reader, I want easy access to James's resume, LinkedIn, and GitHub, so that I can consult supporting materials.
51. As James, I want to edit my introduction, Current work, summaries, tags, and contact links without changing the layout, so that maintaining the portfolio remains straightforward.
52. As a visitor arriving from search, I want a descriptive title and summary, so that I can recognize the portfolio's relevance.
53. As someone sharing the portfolio, I want useful sharing metadata, so that the link is presented clearly to other people.
54. As a visitor, I want the main content available in the initial HTML, so that I can read it without waiting for React to assemble it.
55. As James, I want to keep the existing domain and GitHub Pages hosting, so that the update preserves the established address and deployment approach.
56. As James, I want real cached activity rather than invented examples, so that the portfolio remains an accurate representation of my work.

## Implementation Decisions

- **Starting state and stack:** The spec was prepared from a documentation-only workspace without application code, package configuration, or tests. The existing portfolio repository has since been renamed to `Jtoosh/portfolio-website-v2` and its previous files have been replaced by the approved design documents. Build the new portfolio using the approved React, TypeScript, and Vite stack; the previous application remains historical reference material.
- **Page composition:** Use a compact header with email and supporting links, followed by introduction, skills, projects, Current work with recent commits, and a small contact footer. The site has one page. Project details live in the linked repositories.
- **Content boundary:** Keep personal copy, project records, Skill tags, Education origin, featured status, display order, and contact destinations in editable structured content. Presentation consumes this content without requiring text edits inside layout components.
- **Project representation:** Each project has stable identity, display name, short summary, repository destination, Skill tags, featured status, Education status, and display order. Featured status and Education status are independent properties.
- **Featured project order:** Exercise App, Note of the Day, then Tweeter. Tweeter carries Education. Note of the Day is the selected portfolio name even where repository documentation calls it Ambient Flashcards.
- **Additional project collection:** Network Chess, Study Platform, and JWT Pizza are Additional projects and all carry Education. JWT Pizza may link its associated service repository as supporting material without becoming a seventh project.
- **Approved project summaries:** Use the reviewed project copy as initial portfolio text. Exercise App describes a personal workout planner and iteration through real use. Note of the Day describes a learning-snippet experiment and native macOS scaffold, with accurate attribution of extensive Codex assistance and James's prompting, review, and testing. Tweeter describes course-origin AWS backend work. Additional projects summarize their respective coursework and learning evidence.
- **Project claims:** Tags and summaries must reflect verified evidence. Native macOS work must not be represented as demonstrated iOS/Android implementation. Course simulations must not be represented as real production outcomes. Proposed features must not be described as completed functionality.
- **Introduction placeholder:** Initially display: "I'm James, a software engineer and computer science student. I'm naturally curious, and I learn by building—across web, backend, native apps, and infrastructure. I care about steadily improving my craft and making useful things." Add the visible instruction "TODO: Replace this introduction with my own writing." James owns the final introduction.
- **Current work placeholder:** Display "TODO: Describe the motivation and vision behind what I'm working on now." James supplies the final note. Do not infer that note from recent commit activity.
- **Skill discovery:** Show compact badges with the subtle instruction "Click a skill to see what I've done with it." Every interactive badge has matching evidence in the project collection. Other experience may appear as supporting text rather than a filter with no evidence.
- **Filter contract:** With no selected Skill tags, show exactly the three Featured projects. With one or more selected Skill tags, show all curated projects whose tags intersect the selection. This is OR matching, not AND matching. A project appears once even when it matches several selected tags. Matching Featured projects precede matching Additional projects in stable order.
- **Filter controls:** Badges toggle independently and expose their selected state. A simple clear control removes all selections; deselecting the last badge or clearing restores the default Featured projects. Filtering remains on the page.
- **Visual direction:** Use cool neutral backgrounds, clear typography, generous but restrained spacing, strong contrast, and one subtle blue accent. Keep the layout led by text and project evidence. Honor the system light/dark preference; a manual theme switch is not part of the approved scope.
- **Accessibility and responsiveness:** Use semantic structure, accessible button names and selected states, visible keyboard focus, keyboard-operable controls, and layouts that remain readable and usable on mobile screens. The portfolio should not require decorative motion to convey information.
- **Contact interface:** Email is the primary action, using James's configured email destination. Resume, LinkedIn, and GitHub links are readily accessible. Keep these destinations editable and carry forward the existing verified contact configuration.
- **Initial HTML and discovery:** Generate the main portfolio content as HTML at build time. React supplies filtering and activity refresh after the page loads. Include a descriptive title, page description, canonical URL, and sharing metadata. Hosting remains GitHub Pages at `profile.jamesteuscher.click`.
- **Activity boundary:** A small activity adapter obtains public GitHub commit data and returns displayable commit records plus the time of the last successful retrieval. Presentation is concerned with repository name, first-line commit message, commit date, destination, and freshness rather than GitHub's full response format.
- **Activity scope:** Select recent commits authored by the GitHub identity Jtoosh in public repositories, on their default branches, excluding automated commits. This includes authored contributions to other people's public repositories; do not silently restrict the feed to repositories James owns or only curated projects.
- **Activity retrieval:** GitHub public commit search supports the accepted author and default-branch scope and can be requested by a browser from the static site. Order by author date descending. Collect enough candidates to apply automation exclusions and display the three most recent eligible changes. If fewer than three genuine eligible results are available, show those results rather than inventing entries.
- **Automation exclusion:** Exclude bot-authored activity and commits identified by known automation rules. Keep exclusions explicit and maintainable; authorship alone cannot identify automation that uses a human identity. Avoid blanket exclusion of legitimate manually authored maintenance work.
- **Immediate activity display:** Package a genuine initial snapshot and prefer a valid newer local cache when available. Display existing results before making a network request. A visitor should not wait for GitHub to read the portfolio.
- **Cache and refresh contract:** Cache successful results locally with their successful retrieval timestamp. On a visit, request a background refresh only when the available cache is older than one hour. A cache exactly one hour old is still within that threshold. Successful valid responses replace the cache and advance its timestamp.
- **Failure contract:** Network failure, timeout, rate limiting, or invalid responses retain the prior usable records and successful retrieval timestamp. Browser storage restrictions must not break the page or prevent the packaged fallback from being displayed. Show an unobtrusive freshness timestamp tied to actual retrieval, not the most recent failed attempt.
- **Feed guarantees:** GitHub search may index changes with delay, and requests are rate limited. Present the feed as recent activity rather than an exact real-time guarantee. No server, browser credential, or scheduled rebuild is required for the selected refresh behavior.
- **Delivery:** Prepare the build and GitHub Pages deployment configuration, retain the existing custom domain, and verify the completed site locally. Publishing the website is a separate action from producing this spec and building the local site.

## Testing Decisions

- **Approved primary seam:** James confirmed testing through the public website boundary: its generated HTML and rendered behavior in a browser. Control GitHub responses and the test clock at that boundary. This is the highest useful seam and covers presentation, filtering, and activity together without adding separate interfaces solely for tests.
- **Good tests:** Assert user-visible behavior, accessible controls, meaningful links, project results, actual timestamps, and resilient reading. Avoid tests of component decomposition, hook internals, private helpers, CSS class names, or the exact local-cache storage representation.
- **Existing prior art:** No local test suite or application exists. The previous portfolio's CI runs lint, formatting checks, and a production build; that supplies build-validation precedent but not an existing end-to-end test seam. Establish browser tests against the production build and keep routine static checks appropriate to the new application.
- **Content and presentation coverage:** Verify the three Featured projects and their order, the approved summaries and repository destinations, both visible TODOs, primary email and supporting contact links, and Education on Tweeter and every Additional project.
- **Filter coverage:** Verify default results; a single selection; multiple selections with a fixture that distinguishes OR from AND; a project matching multiple tags appearing once; matching Additional projects; featured-before-additional ordering; individual deselection; clearing; and return to the three-project default after the final selection is removed. Operate the controls by keyboard as well as pointer.
- **Activity coverage:** Serve controlled responses containing eligible authored commits, other authors, automation, and fewer-than-three eligible results. Verify eligibility and ordering through the displayed feed. Cover a contribution in a public repository James does not own. Assert that only genuine eligible results are shown.
- **Cache timing coverage:** Verify immediate cached display without waiting for a response; no refresh while the cache is younger than or exactly one hour; a background refresh once it is older than one hour; successful result replacement; and persistence of a successful refresh across a subsequent visit.
- **Failure coverage:** Test network failure, rate limiting, invalid responses, and unavailable browser storage. Confirm previous or packaged results remain visible, the last-success timestamp does not advance, and the rest of the page remains usable.
- **Static delivery coverage:** Inspect the production HTML without executing JavaScript to confirm the introduction, Featured projects, visible TODOs, and contact destinations are present, along with title, description, canonical URL, and sharing metadata. Then verify hydration and filtering work without replacing or losing the initial content.
- **Responsive and theme coverage:** Verify readable mobile and desktop layouts, system light and dark appearance, visible focus, adequate contrast, meaningful headings, and accessible selected states. Use focused visual inspection for the restrained design rather than brittle pixel-perfect assertions.
- **Determinism:** Use controlled API fixtures and time for automated tests; do not depend on live GitHub activity changing. Verify the real API and contact destinations separately during implementation without making routine test success depend on external uptime.
- **Validation for this spec:** Documentation consistency and coverage are checked now. Application tests and production build checks run during implementation; none can run against an application that does not yet exist.

## Out of Scope

- Additional portfolio pages, separate project case-study pages, or expandable long-form project details.
- A blog, a large uncurated repository directory, or automatic promotion of repositories into the curated project collection.
- A manual theme toggle, elaborate decorative effects, or a visual identity that dominates the content.
- Account creation, authentication, a database, a CMS, contact-form processing, or a new runtime backend.
- Changing the approved framework or moving to another hosting provider.
- Private repository activity, commits from non-default branches, automated activity, or an exact real-time activity guarantee.
- Writing James's final introduction or final Current work motivation and vision on his behalf.
- Guaranteed search rankings, increased visitor counts, analytics installation, or an audience-acquisition campaign.
- Claiming undocumented production results, native mobile implementation, or simulated coursework impact as fact.
- Publishing the website, changing DNS, or modifying the existing live portfolio as part of spec generation.

## Further Notes

- James confirmed the design documents and conversation accurately reflect his intent and requested their conversion into this spec. The spec consolidates the approved completion details and project copy; the introduction and Current work remain deliberate placeholders.
- Use the [domain glossary](../GLOSSARY.md) for Intended reader, Personal content, Featured project, Additional project, Education, Skill tag, and Current work. The [design brief](./design-brief.md) preserves the discussion and research, and the [project copy](./project-copy.md) contains the reviewed summaries, candidate tags, and evidence links.
- No ADRs apply. The interview did not identify a decision meeting the project's threshold for an architectural decision record.
- Keep technology choices proportional to the site. GitHub Pages already supports the static delivery required here; moving providers was not justified by the agreed needs. [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
- Build-generated content and descriptive metadata are informed by [Google's JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics). Google can render JavaScript; the decision is not based on treating React sites as unindexable.
- Activity design is informed by [GitHub REST commit search](https://docs.github.com/en/rest/search/search#search-commits), [commit search qualifiers](https://docs.github.com/en/search-github/searching-on-github/searching-commits), and [browser CORS support](https://docs.github.com/en/rest/using-the-rest-api/using-cors-and-jsonp-to-make-cross-origin-requests). Browser refresh also avoids relying on a scheduled public-repository workflow that can be disabled after prolonged inactivity.
- **Issue publication status:** Published as [GitHub issue #1](https://github.com/Jtoosh/portfolio-website-v2/issues/1) with `ready-for-agent`. James confirmed the default triage labels and selected `AGENTS.md`. Agent setup is recorded in the repository instructions and the issue tracker, triage label, and domain configuration documents.
