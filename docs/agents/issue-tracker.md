# Issue tracker: GitHub

Issues and specs live in GitHub Issues for `Jtoosh/portfolio-website-v2`. Use the `gh` CLI.

## Repository selection

The Git remote points to this repository. Pass `--repo Jtoosh/portfolio-website-v2` explicitly when the destination might otherwise be ambiguous. The repository configured here is authoritative for tickets; do not infer a destination from the workspace directory name.

## Operations

- Create: `gh issue create --repo Jtoosh/portfolio-website-v2 --title "..." --body-file <body-file>`; include the required triage label.
- Read: `gh issue view <number> --repo Jtoosh/portfolio-website-v2 --comments` and fetch labels when needed.
- List: `gh issue list --repo Jtoosh/portfolio-website-v2 --state open --json number,title,body,labels,comments`, adding label/state filters for the task.
- Comment: `gh issue comment <number> --repo Jtoosh/portfolio-website-v2 --body-file <body-file>`.
- Label: `gh issue edit <number> --repo Jtoosh/portfolio-website-v2 --add-label "..."` or `--remove-label "..."`.
- Close: `gh issue close <number> --repo Jtoosh/portfolio-website-v2`.

Preserve multiline Markdown with body files.

## Pull requests as a triage surface

**PRs as a request surface: no.**

## Skill handoffs

- "Publish to the issue tracker" means create a GitHub issue.
- "Fetch the relevant ticket" means read the GitHub issue and its comments.
- Resolve a bare number as an issue or PR using the relevant `gh` command; GitHub shares the number space.
