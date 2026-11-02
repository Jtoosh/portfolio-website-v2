import { expect, test } from "./website-test";

test("language filters and curated card badges are present in production HTML without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    const languages = page.getByRole("region", {
      name: "Languages",
      exact: true,
    });
    await expect(languages.getByRole("button")).toHaveText([
      "TypeScript",
      "JavaScript",
      "Python",
      "Swift",
      "Java",
      "Clear languages",
    ]);
    const assignments = [
      { name: "Exercise App", languages: ["TypeScript"] },
      { name: "Note of the Day", languages: ["Python", "Swift", "TypeScript"] },
      { name: "Tweeter", languages: ["TypeScript"] },
      { name: "Network Chess", languages: ["Java"] },
      { name: "Study Platform", languages: ["JavaScript"] },
      { name: "JWT Pizza", languages: ["TypeScript"] },
    ];
    for (const project of assignments) {
      const card = page.getByRole("article").filter({
        has: page.getByRole("heading", { name: project.name, exact: true }),
      });
      await expect(
        card
          .getByRole("list", { name: `${project.name} languages`, exact: true })
          .getByRole("listitem"),
      ).toHaveText(project.languages);
      await expect(
        card.getByRole("list", { name: `${project.name} skills`, exact: true }),
      ).toHaveCount(1);
    }
  } finally {
    await context.close();
  }
});

test("each language filters the curated projects and clearing restores their order", async ({
  page,
}) => {
  await page.goto("/");
  const languages = page.getByRole("region", {
    name: "Languages",
    exact: true,
  });
  const headings = page.getByRole("article").getByRole("heading", { level: 3 });
  const clear = languages.getByRole("button", { name: "Clear languages" });
  await expect(clear).toBeDisabled();
  const matches = [
    {
      language: "TypeScript",
      projects: ["Exercise App", "Note of the Day", "Tweeter", "JWT Pizza"],
    },
    { language: "JavaScript", projects: ["Study Platform"] },
    { language: "Python", projects: ["Note of the Day"] },
    { language: "Swift", projects: ["Note of the Day"] },
    { language: "Java", projects: ["Network Chess"] },
  ];
  for (const match of matches) {
    const button = languages.getByRole("button", {
      name: match.language,
      exact: true,
    });
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(headings).toHaveText(match.projects);
    await expect(page.getByRole("status")).toHaveText(
      `${match.projects.length} ${match.projects.length === 1 ? "project" : "projects"}`,
    );
    await expect(
      page.getByRole("heading", { name: "Matching projects", exact: true }),
    ).toBeVisible();
    await clear.click();
    await expect(button).toHaveAttribute("aria-pressed", "false");
    await expect(headings).toHaveText([
      "Exercise App",
      "Note of the Day",
      "Tweeter",
      "Network Chess",
      "Study Platform",
      "JWT Pizza",
    ]);
    await expect(clear).toBeDisabled();
  }
});

test("every selected language is required and removing a requirement recovers from zero matches", async ({
  page,
}) => {
  await page.goto("/");
  const languages = page.getByRole("region", {
    name: "Languages",
    exact: true,
  });
  const typescript = languages.getByRole("button", {
    name: "TypeScript",
    exact: true,
  });
  const python = languages.getByRole("button", { name: "Python", exact: true });
  const java = languages.getByRole("button", { name: "Java", exact: true });
  const headings = page.getByRole("article").getByRole("heading", { level: 3 });
  await typescript.click();
  await python.click();
  await expect(headings).toHaveText(["Note of the Day"]);
  await expect(page.getByRole("status")).toHaveText("1 project");
  await java.click();
  await expect(headings).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText("0 projects");
  await expect(
    page.getByText(
      "No projects match this combination of skills and languages.",
      { exact: true },
    ),
  ).toBeVisible();
  await java.click();
  await expect(java).toHaveAttribute("aria-pressed", "false");
  await expect(python).toHaveAttribute("aria-pressed", "true");
  await expect(typescript).toHaveAttribute("aria-pressed", "true");
  await expect(headings).toHaveText(["Note of the Day"]);
  await python.click();
  await expect(headings).toHaveText([
    "Exercise App",
    "Note of the Day",
    "Tweeter",
    "JWT Pizza",
  ]);
  await typescript.click();
  await expect(headings).toHaveCount(6);
  await expect(
    page.getByRole("heading", { name: "Projects", exact: true }),
  ).toBeVisible();
});

test("skills and languages intersect and each clear control preserves the other group's requirements", async ({
  page,
}) => {
  await page.goto("/");
  const skills = page.getByRole("region", { name: "Skills", exact: true });
  const languages = page.getByRole("region", {
    name: "Languages",
    exact: true,
  });
  const backend = skills.getByRole("button", { name: "Backend", exact: true });
  const typescript = languages.getByRole("button", {
    name: "TypeScript",
    exact: true,
  });
  const python = languages.getByRole("button", { name: "Python", exact: true });
  const clearSkills = skills.getByRole("button", { name: "Clear skills" });
  const clearLanguages = languages.getByRole("button", {
    name: "Clear languages",
  });
  const headings = page.getByRole("article").getByRole("heading", { level: 3 });
  await backend.click();
  await typescript.click();
  await expect(headings).toHaveText(["Exercise App", "Tweeter"]);
  await clearLanguages.click();
  await expect(backend).toHaveAttribute("aria-pressed", "true");
  await expect(headings).toHaveText([
    "Exercise App",
    "Tweeter",
    "Network Chess",
    "Study Platform",
  ]);
  await python.click();
  await expect(headings).toHaveCount(0);
  await clearSkills.click();
  await expect(python).toHaveAttribute("aria-pressed", "true");
  await expect(clearSkills).toBeDisabled();
  await expect(headings).toHaveText(["Note of the Day"]);
  await clearLanguages.click();
  await expect(headings).toHaveCount(6);
  await expect(page.getByRole("status")).toHaveText("6 projects");
});

test("language controls support keyboard use on narrow screens without navigation or hydration errors", async ({
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
  const languages = page.getByRole("region", {
    name: "Languages",
    exact: true,
  });
  const swift = languages.getByRole("button", { name: "Swift", exact: true });
  const clear = languages.getByRole("button", { name: "Clear languages" });
  await swift.focus();
  expect(
    await swift.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).not.toBe("none");
  const background = await swift.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.keyboard.press("Space");
  await expect(swift).toHaveAttribute("aria-pressed", "true");
  expect(
    await swift.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    ),
  ).not.toBe(background);
  await expect(
    page.getByRole("article").getByRole("heading", { level: 3 }),
  ).toHaveText(["Note of the Day"]);
  await page.keyboard.press("Enter");
  await expect(swift).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("article")).toHaveCount(6);
  await page.keyboard.press("Space");
  await page.keyboard.press("Tab");
  await expect(
    languages.getByRole("button", { name: "Java", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(clear).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(clear).toBeDisabled();
  await expect(page.getByRole("article")).toHaveCount(6);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(navigations).toEqual([]);
  expect(errors).toEqual([]);
});
