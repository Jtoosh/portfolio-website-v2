# Adjusting projects and skill tags

All repository choices and skill tags live in [`src/content.ts`](../src/content.ts).
You can change the collection without editing React components or CSS.

## What changed

- The project list includes all six selected repositories, including coursework.
- It has room for three complete cards; scroll to see the remaining projects.
- The list adjusts to screen width and summary length, and supports keyboard scrolling.
- Five broad skill tags replace the individual language and framework tags.
- Select several skills to include projects matching any of them.
- Clearing skills restores the full list. Changing filters returns to the start.
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

## Check your edits

Run `npm run build`, `npm test`, and `npm run format:check`.
Run `npm run dev` to check your chosen projects and filters in a browser.
Rebuild and publish through the existing GitHub Pages workflow to update the live site.

Tracking: [scrollable repositories (#10)](https://github.com/Jtoosh/portfolio-website-v2/issues/10)
and [editable skill tags (#11)](https://github.com/Jtoosh/portfolio-website-v2/issues/11).
