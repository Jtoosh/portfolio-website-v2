# Recent public activity

`src/activity-snapshot.json` packages genuine GitHub activity for immediate,
build-generated reading. Its `retrievedAt` is the successful retrieval time,
not the build time. The initial snapshot came from the public commit search on
October 6, 2026 at 17:47:27.575468 UTC. The source response was replayed through
the adapter and a fresh live request independently confirmed the same three
commit SHAs, messages, repositories, dates, and destinations.

Run `npm run activity:refresh`, review the resulting JSON, then rebuild with
`npm run build`. A failed refresh leaves the packaged snapshot untouched. No
credential or server is required. To reproduce saved evidence, run:

```sh
npm run activity:refresh -- --source /path/to/github-response.json --retrieved-at 2026-10-06T17:47:27.575468Z --output /path/to/snapshot.json
```

For a saved response, supply its actual successful retrieval time. Never use the
replay or build time to make older activity look freshly retrieved.

The shared adapter is `src/activity-adapter.mjs`, with a TypeScript contract in
`src/activity-adapter.d.mts`. `retrieveActivity({ fetcher?, now?, signal? })`
returns `{ retrievedAt, commits }` or throws. Each display record contains
`sha`, `repository`, first-line `message`, `authoredAt`, and `url`.
`snapshotFromSearchResponses(responses, retrievedAt)` supports saved evidence.

The request uses `author:Jtoosh is:public`, sorting by author date descending.
[GitHub commit search](https://docs.github.com/en/search-github/searching-on-github/searching-commits)
searches default branches. There are no repository ownership or curated-project
restrictions. The adapter gathers 100 candidates per request, requests additional
pages when fewer than three eligible unique changes remain, and stops at GitHub's
1,000-result search limit. It validates identity, public visibility, dates, SHA,
and destination; excludes identified automation; sorts; deduplicates globally by
SHA; and displays up to three results. Equal dates use repository name then SHA
for stable ordering. An empty result remains empty.

Automation rules are explicit in the adapter: bot author/committer types, names
or logins ending `[bot]`, listed known automation identities, and matching
`Generated-by:` trailers. Human-authored `chore`, `docs`, merge, maintenance, AI
assistance, and messages mentioning automated tests are eligible. Undisclosed
automation using human credentials cannot reliably be recognized; extend rules
when a specific signature is established rather than excluding broad words.

The current slice renders the packaged snapshot without a runtime request.
Browser cache and hourly background refresh follow in ticket #5 using this
same adapter. Incomplete search responses and unsuccessful HTTP responses throw,
so callers can retain their prior usable data and successful retrieval timestamp.
The maintenance command uses a 15-second timeout and writes atomically after
successful validation.

Website tests use controlled source responses and time, then inspect generated
HTML in a browser. `PORTFOLIO_ACTIVITY_SNAPSHOT=/absolute/path/to/snapshot.json`
lets Vite build controlled content without replacing the delivered snapshot.
Routine tests do not require GitHub availability.
