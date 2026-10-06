import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function candidate(
  sha: string,
  message: string,
  date: string,
  repository = "Jtoosh/sample",
  overrides = {},
) {
  return {
    sha: sha.repeat(40),
    html_url: `https://github.com/${repository}/commit/${sha.repeat(40)}`,
    author: { login: "Jtoosh", type: "User" },
    committer: { login: "Jtoosh", type: "User" },
    repository: { full_name: repository, private: false },
    commit: {
      message,
      author: { name: "James", date },
      committer: { name: "James" },
    },
    ...overrides,
  };
}

async function showControlledSource(
  page: import("@playwright/test").Page,
  items: unknown[],
) {
  const directory = mkdtempSync(
    join(process.cwd(), "node_modules", ".portfolio-activity-test-"),
  );
  try {
    const source = join(directory, "github.json");
    const snapshot = join(directory, "snapshot.json");
    writeFileSync(
      source,
      JSON.stringify({
        total_count: items.length,
        incomplete_results: false,
        items,
      }),
    );
    execFileSync(
      process.execPath,
      [
        "scripts/refresh-activity.mjs",
        "--source",
        source,
        "--output",
        snapshot,
        "--retrieved-at",
        "2026-01-06T00:00:00Z",
      ],
      { cwd: process.cwd() },
    );
    const renderDirectory = join(directory, "render");
    execFileSync(
      process.execPath,
      [
        "node_modules/vite/bin/vite.js",
        "build",
        "--ssr",
        "src/prerender.tsx",
        "--outDir",
        renderDirectory,
      ],
      { env: { ...process.env, PORTFOLIO_ACTIVITY_SNAPSHOT: snapshot } },
    );
    const html = execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import { html } from ${JSON.stringify(join(renderDirectory, "prerender.js"))}; process.stdout.write(html);`,
      ],
      { encoding: "utf8" },
    );
    await page.route("**/controlled-activity", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: `<!doctype html><html><body>${html}</body></html>`,
      }),
    );
    await page.goto("/controlled-activity");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("the generated feed orders eligible public default-branch author activity across repository ownership, with first-line messages and global SHA deduplication", async ({
  page,
}) => {
  await showControlledSource(page, [
    candidate(
      "a",
      "Manual maintenance\nA longer description",
      "2026-01-01T12:00:00Z",
    ),
    candidate(
      "b",
      "Contribution elsewhere",
      "2026-01-03T12:00:00Z",
      "someone/other-project",
    ),
    candidate(
      "b",
      "Contribution elsewhere",
      "2026-01-03T12:00:00Z",
      "fork/other-project",
    ),
    candidate("c", "Add new automated test", "2026-01-02T12:00:00Z"),
    candidate("d", "Other author", "2026-01-05T12:00:00Z", "Jtoosh/sample", {
      author: { login: "Other", type: "User" },
    }),
    candidate("e", "Private work", "2026-01-05T12:00:00Z", "Jtoosh/sample", {
      repository: { full_name: "Jtoosh/sample", private: true },
    }),
  ]);
  const activity = page.getByRole("region", { name: "Recent activity" });
  await expect(activity.getByRole("link")).toHaveText([
    "Contribution elsewhere",
    "Add new automated test",
    "Manual maintenance",
  ]);
  await expect(activity.getByRole("link").first()).toHaveAttribute(
    "href",
    "https://github.com/fork/other-project/commit/" + "b".repeat(40),
  );
  await expect(activity).not.toContainText("A longer description");
});

test("automation is excluded even with a human author, without inventing records or discarding manually authored maintenance", async ({
  page,
}) => {
  await showControlledSource(page, [
    candidate("a", "chore: tidy dependencies", "2026-01-01T12:00:00Z"),
    candidate("b", "Bot change", "2026-01-03T12:00:00Z", "Jtoosh/sample", {
      author: { login: "Jtoosh", type: "Bot" },
    }),
    candidate(
      "c",
      "Scheduled change",
      "2026-01-03T12:00:00Z",
      "Jtoosh/sample",
      { committer: { login: "github-actions[bot]", type: "Bot" } },
    ),
    candidate(
      "d",
      "Generated release\n\nGenerated-by: release-please[bot]",
      "2026-01-03T12:00:00Z",
    ),
  ]);
  const activity = page.getByRole("region", { name: "Recent activity" });
  await expect(activity.getByRole("listitem")).toHaveCount(1);
  await expect(activity.getByRole("link")).toHaveText([
    "chore: tidy dependencies",
  ]);
  await expect(activity.locator("time").last()).toHaveAttribute(
    "datetime",
    "2026-01-06T00:00:00Z",
  );
});

test("an empty genuine result is stated honestly with its successful retrieval time", async ({
  page,
}) => {
  await showControlledSource(page, []);
  const activity = page.getByRole("region", { name: "Recent activity" });
  await expect(
    activity.getByText(
      "No eligible public commits were found at the last retrieval.",
    ),
  ).toBeVisible();
  await expect(activity.getByRole("listitem")).toHaveCount(0);
  await expect(activity.locator("time")).toHaveAttribute(
    "datetime",
    "2026-01-06T00:00:00Z",
  );
});
