import { expect, test } from "@playwright/test";

test("genuine cached activity is readable beside Current work in the initial HTML", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  const activity = page.getByRole("region", { name: "Recent activity" });
  await expect(activity).toBeVisible();
  await expect(activity.getByRole("listitem")).toHaveCount(3);
  await expect(activity.getByRole("link")).toHaveText([
    "feat: support workout category focusing",
    "docs: update design.md",
    "fix: guard production migrations against local database fallback",
  ]);
  await expect(activity.getByRole("link").first()).toHaveAttribute(
    "href",
    "https://github.com/Jtoosh/exercise-app/commit/50a1a8b1588c93c1192b55fad7b7c7f497a2fce7",
  );
  await expect(
    activity.getByText("Jtoosh/exercise-app", { exact: true }),
  ).toHaveCount(3);
  await expect(activity.locator("time").last()).toHaveAttribute(
    "datetime",
    "2026-10-06T17:47:27.575468Z",
  );
  await expect(activity).toContainText("September 22, 2026");
  await expect(
    page.getByText(
      "TODO: Describe the motivation and vision behind what I'm working on now.",
      { exact: true },
    ),
  ).toBeVisible();
  await context.close();
});
