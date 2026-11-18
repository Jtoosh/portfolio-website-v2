import { expect, test } from "./website-test";
import { openFilter } from "./filter-controls";

test("paired dropdowns support arrow navigation, Escape, Tab dismissal, and one open group", async ({
  page,
}) => {
  await page.goto("/");
  const skills = page.getByRole("button", {
    name: "Filter by skills",
    exact: true,
  });
  const languages = page.getByRole("button", {
    name: "Filter by languages",
    exact: true,
  });
  await skills.focus();
  await page.keyboard.press("ArrowDown");
  const options = page.getByRole("group", {
    name: "Skills options",
    exact: true,
  });
  await expect(
    options.getByRole("button", { name: "Web development", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("End");
  await expect(
    options.getByRole("button", { name: "Native apps", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(
    options.getByRole("button", { name: "Web development", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Home");
  await page.keyboard.press("Space");
  await expect(page.getByRole("status")).toHaveText("2 projects");
  await page.keyboard.press("Escape");
  await expect(skills).toBeFocused();
  await expect(skills).toHaveAttribute("aria-expanded", "false");
  await expect(skills).toHaveAccessibleDescription(/^1 skills selected/);
  await skills.click();
  await languages.click();
  await expect(skills).toHaveAttribute("aria-expanded", "false");
  await expect(languages).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("ArrowUp");
  await expect(
    page.getByRole("button", { name: "Java", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  // No language selected: its disabled clear control is skipped.
  await expect(
    page.getByRole("button", {
      name: "Remove skill: Web development",
      exact: true,
    }),
  ).toBeFocused();
  await expect(languages).toHaveAttribute("aria-expanded", "false");
});

test("closed panels leave removable selections and Reset available, preserving keyboard focus", async ({
  page,
}) => {
  await page.goto("/");
  const skills = await openFilter(page, "Skills");
  await skills.getByRole("button", { name: "Backend", exact: true }).click();
  const languages = await openFilter(page, "Languages");
  await languages
    .getByRole("button", { name: "TypeScript", exact: true })
    .click();
  await languages.getByRole("button", { name: "Python", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("0 projects");
  await page
    .getByRole("heading", { name: "Matching projects", exact: true })
    .click();
  const languageTrigger = page.getByRole("button", {
    name: "Filter by languages",
    exact: true,
  });
  await expect(languageTrigger).toHaveAttribute("aria-expanded", "false");
  const removePython = page.getByRole("button", {
    name: "Remove language: Python",
    exact: true,
  });
  await removePython.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("2 projects");
  await expect(languageTrigger).toBeFocused();
  await expect(
    page.getByRole("button", {
      name: "Remove language: TypeScript",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Clear all filters", exact: true })
    .click();
  await expect(page.getByRole("status")).toHaveText("6 projects");
  await expect(
    page.getByRole("button", { name: "Filter by skills", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("button", { name: /^Remove (skill|language):/ }),
  ).toHaveCount(0);
});

test("panels stay within narrow and short viewports and reposition on resize", async ({
  page,
}) => {
  await page.goto("/");
  for (const size of [
    { width: 320, height: 568 },
    { width: 375, height: 812 },
    { width: 800, height: 400 },
  ]) {
    await page.setViewportSize(size);
    const section = await openFilter(page, "Languages");
    const panel = section.getByRole("group", {
      name: "Languages options",
      exact: true,
    });
    // Reduced motion keeps geometry checks independent of the entry transform.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() =>
        panel.evaluate((element) => {
          const rect = element.getBoundingClientRect();
          return (
            rect.left >= 0 &&
            rect.top >= 0 &&
            rect.right <= innerWidth &&
            rect.bottom <= innerHeight
          );
        }),
      )
      .toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("filters honor reduced motion, inherit dark mode, and ship without prototype tools", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  await page.goto("/?variant=E");
  await expect(
    page.getByRole("navigation", { name: "Throwaway prototype variants" }),
  ).toHaveCount(0);
  const section = await openFilter(page, "Skills");
  const panel = section.getByRole("group", {
    name: "Skills options",
    exact: true,
  });
  const darkBackground = await panel.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  const duration = await panel.evaluate(
    (element) => getComputedStyle(element).transitionDuration,
  );
  expect(duration.split(",").every((value) => parseFloat(value) <= 0.001)).toBe(
    true,
  );
  await page.emulateMedia({ colorScheme: "light" });
  expect(
    await panel.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    ),
  ).not.toBe(darkBackground);
});

test("reverse Tab dismisses the panel while clicking its trigger still closes it", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Filter by skills",
    exact: true,
  });
  const options = page.getByRole("group", {
    name: "Skills options",
    exact: true,
  });
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    options.getByRole("button", { name: "Web development", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Shift+Tab");
  await expect(trigger).not.toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("clearing a group keeps focus on an enabled choice before disabling Clear", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Filter by skills",
    exact: true,
  });
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Space");
  await page.keyboard.press("End");
  await page.keyboard.press("Tab");
  const clear = page.getByRole("button", { name: "Clear skills", exact: true });
  await expect(clear).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(clear).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Web development", exact: true }),
  ).toBeFocused();
  await expect(page.getByRole("status")).toHaveText("6 projects");
  await page.keyboard.press("Shift+Tab");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});
