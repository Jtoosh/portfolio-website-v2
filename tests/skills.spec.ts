import { expect, test } from "./website-test";

test("selecting a Skill tag filters matching Featured and Additional projects on the same page", async ({
  page,
}) => {
  await page.goto("/");
  const skills = page.getByRole("region", { name: "Skills", exact: true });
  await expect(
    skills.getByText("Click a skill to see what I've done with it.", {
      exact: true,
    }),
  ).toBeVisible();
  const databases = skills.getByRole("button", {
    name: "Databases",
    exact: true,
  });
  await expect(databases).toHaveAttribute("aria-pressed", "false");
  await databases.click();
  await expect(databases).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("article").getByRole("heading", { level: 3 }),
  ).toHaveText(["Exercise App", "Tweeter", "Network Chess", "Study Platform"]);
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
  const databases = skills.getByRole("button", {
    name: "Databases",
    exact: true,
  });
  const native = skills.getByRole("button", {
    name: "Native apps",
    exact: true,
  });
  const backend = skills.getByRole("button", {
    name: "Backend",
    exact: true,
  });
  await databases.click();
  await native.click();
  await backend.click();
  await expect(databases).toHaveAttribute("aria-pressed", "true");
  await expect(native).toHaveAttribute("aria-pressed", "true");
  await expect(backend).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("article").getByRole("heading", { level: 3 }),
  ).toHaveText([
    "Exercise App",
    "Note of the Day",
    "Tweeter",
    "Network Chess",
    "Study Platform",
  ]);
  await native.click();
  await expect(native).toHaveAttribute("aria-pressed", "false");
  await expect(
    page.getByRole("article").getByRole("heading", { level: 3 }),
  ).toHaveText(["Exercise App", "Tweeter", "Network Chess", "Study Platform"]);
  await databases.click();
  await expect(
    page.getByRole("article").getByRole("heading", { level: 3 }),
  ).toHaveText(["Exercise App", "Tweeter", "Network Chess", "Study Platform"]);
  await backend.click();
  await expect(
    page.getByRole("article").getByRole("heading", { level: 3 }),
  ).toHaveText([
    "Exercise App",
    "Note of the Day",
    "Tweeter",
    "Network Chess",
    "Study Platform",
    "JWT Pizza",
  ]);
  await expect(
    page.getByRole("heading", { name: "Projects", exact: true }),
  ).toBeVisible();
});

test("web and operations skills include reviewed Additional projects after matching Featured projects", async ({
  page,
}) => {
  await page.goto("/");
  const skills = page.getByRole("region", { name: "Skills", exact: true });
  await skills
    .getByRole("button", { name: "Cloud & DevOps", exact: true })
    .click();
  await skills
    .getByRole("button", { name: "Web development", exact: true })
    .click();
  await expect(
    page.getByRole("article").getByRole("heading", { level: 3 }),
  ).toHaveText(["Exercise App", "Tweeter", "Study Platform", "JWT Pizza"]);
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
  const web = skills.getByRole("button", {
    name: "Web development",
    exact: true,
  });
  const clear = skills.getByRole("button", {
    name: "Clear skills",
    exact: true,
  });
  await expect(clear).toBeDisabled();
  await web.focus();
  expect(
    await web.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).not.toBe("none");
  const unselectedBackground = await web.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.keyboard.press("Space");
  await expect(web).toHaveAttribute("aria-pressed", "true");
  expect(
    await web.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(unselectedBackground);
  await page.keyboard.press("Tab");
  const backend = skills.getByRole("button", {
    name: "Backend",
    exact: true,
  });
  await expect(backend).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(backend).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("article").getByRole("heading", { level: 3 }),
  ).toHaveText(["Exercise App", "Tweeter", "Network Chess", "Study Platform"]);
  await clear.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("article").getByRole("heading", { level: 3 }),
  ).toHaveText([
    "Exercise App",
    "Note of the Day",
    "Tweeter",
    "Network Chess",
    "Study Platform",
    "JWT Pizza",
  ]);
  await expect(web).toHaveAttribute("aria-pressed", "false");
  await expect(backend).toHaveAttribute("aria-pressed", "false");
  await expect(clear).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(navigations).toEqual([]);
  expect(errors).toEqual([]);
});
