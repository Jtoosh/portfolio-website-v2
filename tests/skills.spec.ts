import { expect, test } from "@playwright/test";

test("selecting a Skill tag reveals matching Additional projects on the same page", async ({
  page,
}) => {
  await page.goto("/");
  const skills = page.getByRole("region", { name: "Skills", exact: true });
  await expect(
    skills.getByText("Click a skill to see what I've done with it.", {
      exact: true,
    }),
  ).toBeVisible();
  const sql = skills.getByRole("button", { name: "SQL", exact: true });
  await expect(sql).toHaveAttribute("aria-pressed", "false");
  await sql.click();
  await expect(sql).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { level: 3 })).toHaveText([
    "Exercise App",
    "Network Chess",
  ]);
  const chess = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "Network Chess" }) });
  await expect(chess).toContainText(
    "A networked Java chess application developed through coursework, with SQL persistence and WebSocket game updates. My notes trace lessons from testing, serialization, shared state, and debugging multiplayer behavior.",
  );
  await expect(chess.getByText("Education", { exact: true })).toBeVisible();
  await expect(chess.getByRole("link")).toHaveAttribute(
    "href",
    "https://github.com/Jtoosh/byu-cs240",
  );
  await expect(page).toHaveURL("/");
});

test("independent selections use any-match filtering without duplicates and can be individually removed", async ({
  page,
}) => {
  await page.goto("/");
  const skills = page.getByRole("region", { name: "Skills", exact: true });
  const sql = skills.getByRole("button", { name: "SQL", exact: true });
  const swift = skills.getByRole("button", { name: "Swift", exact: true });
  const typescript = skills.getByRole("button", {
    name: "TypeScript",
    exact: true,
  });
  await sql.click();
  await swift.click();
  await typescript.click();
  await expect(sql).toHaveAttribute("aria-pressed", "true");
  await expect(swift).toHaveAttribute("aria-pressed", "true");
  await expect(typescript).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { level: 3 })).toHaveText([
    "Exercise App",
    "Note of the Day",
    "Tweeter",
    "Network Chess",
  ]);
  await swift.click();
  await expect(swift).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("heading", { level: 3 })).toHaveText([
    "Exercise App",
    "Tweeter",
    "Network Chess",
  ]);
  await sql.click();
  await expect(page.getByRole("heading", { level: 3 })).toHaveText([
    "Exercise App",
    "Tweeter",
  ]);
  await typescript.click();
  await expect(page.getByRole("heading", { level: 3 })).toHaveText([
    "Exercise App",
    "Note of the Day",
    "Tweeter",
  ]);
  await expect(
    page.getByRole("heading", { name: "Featured projects", exact: true }),
  ).toBeVisible();
});

test("web and operations skills reveal reviewed Additional projects after matching Featured projects", async ({
  page,
}) => {
  await page.goto("/");
  const skills = page.getByRole("region", { name: "Skills", exact: true });
  await skills.getByRole("button", { name: "AWS", exact: true }).click();
  await skills.getByRole("button", { name: "React", exact: true }).click();
  await expect(page.getByRole("heading", { level: 3 })).toHaveText([
    "Exercise App",
    "Tweeter",
    "Study Platform",
    "JWT Pizza",
  ]);
  const study = page.getByRole("article").filter({
    has: page.getByRole("heading", { name: "Study Platform", exact: true }),
  });
  await expect(study).toContainText(
    "A course-built study platform that followed a progression from HTML to React, an Express backend, MongoDB, and WebSockets.",
  );
  await expect(study.getByRole("link")).toHaveAttribute(
    "href",
    "https://github.com/Jtoosh/byu-cs260",
  );
  const pizza = page.getByRole("article").filter({
    has: page.getByRole("heading", { name: "JWT Pizza", exact: true }),
  });
  await expect(pizza).toContainText(
    "A course application used to practice deployment and operations, including automated delivery through AWS, Docker, and monitoring. I also explored cron-based traffic generation to support the monitoring exercises.",
  );
  await expect(pizza.getByRole("link")).toHaveAttribute(
    "href",
    "https://github.com/Jtoosh/jwt-pizza",
  );
  await expect(study.getByText("Education", { exact: true })).toBeVisible();
  await expect(pizza.getByText("Education", { exact: true })).toBeVisible();
  await expect(
    page
      .getByRole("article")
      .filter({
        has: page.getByRole("heading", { name: "Tweeter", exact: true }),
      })
      .getByText("Education", { exact: true }),
  ).toBeVisible();
});

test("keyboard visitors can toggle Skill tags and clear selections without reloading or hydration errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const navigations: string[] = [];
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) navigations.push(frame.url());
  });
  const skills = page.getByRole("region", { name: "Skills", exact: true });
  const react = skills.getByRole("button", { name: "React", exact: true });
  const clear = skills.getByRole("button", {
    name: "Clear skills",
    exact: true,
  });
  await expect(clear).toBeDisabled();
  await react.focus();
  expect(
    await react.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).not.toBe("none");
  const unselectedBackground = await react.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.keyboard.press("Space");
  await expect(react).toHaveAttribute("aria-pressed", "true");
  expect(
    await react.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    ),
  ).not.toBe(unselectedBackground);
  await page.keyboard.press("Tab");
  const typescript = skills.getByRole("button", {
    name: "TypeScript",
    exact: true,
  });
  await expect(typescript).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(typescript).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { level: 3 })).toHaveText([
    "Exercise App",
    "Tweeter",
    "Study Platform",
  ]);
  await clear.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 3 })).toHaveText([
    "Exercise App",
    "Note of the Day",
    "Tweeter",
  ]);
  await expect(react).toHaveAttribute("aria-pressed", "false");
  await expect(typescript).toHaveAttribute("aria-pressed", "false");
  await expect(clear).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(navigations).toEqual([]);
  expect(errors).toEqual([]);
});
