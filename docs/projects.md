# Adjusting projects, skill tags, and language tags

All repository choices, skill tags, and language tags live in [`src/content.ts`](../src/content.ts).
You can change the collection without editing React components or CSS.

## What changed

- The project list includes all six selected repositories, including coursework.
- It has room for three complete cards; scroll to see the remaining projects.
- The list adjusts to screen width and summary length, and supports keyboard scrolling.
- Broad skill tags and curated language tags have separate filter groups and card labels.
- Select several tags to include only projects matching every selected skill and language. For example, TypeScript + Python shows Note of the Day; adding Backend shows no matches.
- Combinations with no shared projects show 0 projects and a short explanatory message; remove a tag or clear selections to explore again.
- Clear skills and Clear languages each reset only their own group. Clearing both restores the full list. Changing filters returns to the start.
- Education labels, project summaries, and repository links are preserved.
- Every selected project is available in the generated HTML without JavaScript.

## Choose and order repositories

Edit an entry in the `projects` array:

- `visible`: use `true` to include it or `false` to hide it.
- `featured`: featured projects appear before additional projects.
- `order`: lower numbers appear first within each group.
- `education`: use `true` for coursework, including featured coursework.
- `name`, `summary`, and `repository`: change the displayed text and destination.
- `tags`: choose the broad skill tags demonstrated by the project.
- `languages`: choose programming languages used substantively in the linked repository; use `[]` if none of the catalog languages apply.
- `id`: keep a unique, stable identifier for each project.

To add a repository, copy an existing entry and update these fields.
To remove one, set `visible: false` or delete the entry.
The first three projects in the resulting order lead the list.

## Adjust skill tags

Edit `skillTags` near the top of `src/content.ts` to add, rename, reorder, or remove tags.
Assign tags using the same spelling in each project's `tags` array.
When renaming or removing a tag, update every project using it too.
TypeScript catches project tags that are missing from the catalog.
Only tags used by a visible project appear as filter buttons.
The same labels appear on project cards.

## Add or adjust language tags

Edit `languageTags` near the top of `src/content.ts` to add, rename, reorder, or remove languages.
Assign them using the same spelling in each project's `languages` array.
TypeScript catches assignments missing from the catalog. Update project assignments when renaming or removing a language.
Only languages assigned to visible projects appear as filter buttons, in catalog order.

For example, to introduce Rust for a new project:

1. Add `"Rust"` to `languageTags`.
2. Add `languages: ["Rust"]` to that project's entry (along with its other fields), and set `visible: true`.
3. Build and check the page. Rust appears as a filter and a badge without changes to React components or CSS.

Choose substantive application code in the linked repository. Omit languages found only in starter resources, unrelated exercises, configuration, or isolated test scripts. A separately hosted backend does not determine the linked repository's tags.
For example, JWT Pizza is tagged TypeScript for its frontend repository; its separate JavaScript service does not add a JavaScript tag.

## Check your edits

Run `npm run build`, `npm test`, and `npm run format:check`.
Run `npm run dev` to check your chosen projects and filters in a browser.
Push or merge changes to `main` to validate, build, and publish through the GitHub Pages workflow automatically.
You can also run the workflow manually from Actions.

Tracking: [scrollable repositories (#10)](https://github.com/Jtoosh/portfolio-website-v2/issues/10)
and [editable skill tags (#11)](https://github.com/Jtoosh/portfolio-website-v2/issues/11).
Intersection filtering: [#15](https://github.com/Jtoosh/portfolio-website-v2/issues/15),
with [implementation spec #19](https://github.com/Jtoosh/portfolio-website-v2/issues/19).

Language tags: [#16](https://github.com/Jtoosh/portfolio-website-v2/issues/16).
