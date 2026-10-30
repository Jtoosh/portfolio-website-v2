import { expect, test } from "./website-test";

test("all selected repositories are available by default with five general Skill tags", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page
      .getByRole("region", { name: "Skills", exact: true })
      .getByRole("button"),
  ).toHaveText([
    "Web development",
    "Backend",
    "Databases",
    "Cloud & DevOps",
    "Native apps",
    "Clear skills",
  ]);
  await expect(page.getByRole("status")).toHaveText("6 projects");
  const list = page.getByRole("region", { name: "Project list", exact: true });
  await expect(list.getByRole("heading", { level: 3 })).toHaveText([
    "Exercise App",
    "Note of the Day",
    "Tweeter",
    "Network Chess",
    "Study Platform",
    "JWT Pizza",
  ]);
  await expect(list.getByText("Education", { exact: true })).toHaveCount(4);
  for (const link of await list.getByRole("link").all()) {
    await expect(link).toHaveAttribute(
      "href",
      /^https:\/\/github\.com\/Jtoosh\//,
    );
  }
});

test("the scrollable component fits three complete cards and resizes with the reading layout", async ({
  page,
}) => {
  await page.goto("/");
  const list = page.getByRole("region", { name: "Project list", exact: true });
  for (const width of [1280, 375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        list.evaluate((element) => {
          const top = element.getBoundingClientRect().top;
          const third = element.children[2].getBoundingClientRect();
          // The viewport includes exactly three complete cards and its borders.
          return Math.abs(element.clientHeight - (third.bottom - top - 1));
        }),
      )
      .toBeLessThanOrEqual(1);
    expect(
      await list.evaluate(
        (element) => element.scrollHeight > element.clientHeight,
      ),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("keyboard visitors can scroll to coursework and tab through every repository", async ({
  page,
}) => {
  await page.goto("/");
  const list = page.getByRole("region", { name: "Project list", exact: true });
  await list.focus();
  expect(
    await list.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).not.toBe("none");
  await page.keyboard.press("End");
  await expect
    .poll(() => list.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  const pizza = list.getByRole("link", { name: "View JWT Pizza repository" });
  await expect(pizza).toBeInViewport();
  await page.keyboard.press("Home");
  await expect
    .poll(() => list.evaluate((element) => element.scrollTop))
    .toBe(0);
  for (const link of await list.getByRole("link").all()) {
    await page.keyboard.press("Tab");
    await expect(link).toBeFocused();
    await expect(link).toBeInViewport();
  }
});

test("pointer scrolling reveals additional coursework and changing filters returns to the start", async ({
  page,
}) => {
  await page.goto("/");
  const list = page.getByRole("region", { name: "Project list", exact: true });
  await list.scrollIntoViewIfNeeded();
  await list.hover();
  await page.mouse.wheel(0, 1200);
  await expect
    .poll(() => list.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "Databases", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("4 projects");
  await expect
    .poll(() => list.evaluate((element) => element.scrollTop))
    .toBe(0);
  await page.getByRole("button", { name: "Native apps", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("5 projects");
  await page.getByRole("button", { name: "Databases", exact: true }).click();
  await expect(list.getByRole("heading", { level: 3 })).toHaveText([
    "Note of the Day",
  ]);
  await expect(page.getByRole("status")).toHaveText("1 project");
  expect(
    await list.evaluate(
      (element) => element.scrollHeight <= element.clientHeight,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Clear skills", exact: true }).click();
  await expect(list.getByRole("article")).toHaveCount(6);
  await expect(page.getByRole("status")).toHaveText("6 projects");
  await expect
    .poll(() => list.evaluate((element) => element.scrollTop))
    .toBe(0);
});
