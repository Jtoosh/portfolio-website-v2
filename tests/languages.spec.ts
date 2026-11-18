import { expect, test } from "./website-test";
import { openFilter } from "./filter-controls";

test("language filters and curated card badges are present in production HTML without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    await openFilter(page, "Languages");
    const languages = page.getByRole("region", {
      name: "Languages",
      exact: true,
    });
    await expect(
      languages
        .getByRole("group", { name: "Languages options" })
        .getByRole("button"),
    ).toHaveText([
      "TypeScript",
      "JavaScript",
      "Python",
      "Swift",
      "Java",
      "Clear languages",
    ]);
    // Read the browser's accessibility tree; DOM-based ARIA snapshots do
    // not include the popover invoker's implicit expanded state.
    const accessibility = await context.newCDPSession(page);
    await expect
      .poll(async () => {
        const { nodes } = await accessibility.send(
          "Accessibility.getFullAXTree",
        );
        const button = nodes.find(
          (node) =>
            node.role?.value === "button" &&
            node.name?.value === "Filter by languages",
        );
        return button?.properties?.find(
          (property) => property.name === "expanded",
        )?.value.value;
      })
      .toBe(true);
    await accessibility.detach();
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
  await openFilter(page, "Languages");
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
  await openFilter(page, "Languages");
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
  const headings = page.getByRole("article").getByRole("heading", { level: 3 });
  const skills = await openFilter(page, "Skills");
  await skills.getByRole("button", { name: "Backend", exact: true }).click();
  const languages = await openFilter(page, "Languages");
  await languages
    .getByRole("button", { name: "TypeScript", exact: true })
    .click();
  await expect(headings).toHaveText(["Exercise App", "Tweeter"]);
  await languages.getByRole("button", { name: "Clear languages" }).click();
  await expect(
    page.getByRole("button", { name: "Remove skill: Backend", exact: true }),
  ).toBeVisible();
  await expect(headings).toHaveText([
    "Exercise App",
    "Tweeter",
    "Network Chess",
    "Study Platform",
  ]);
  await languages.getByRole("button", { name: "Python", exact: true }).click();
  await expect(headings).toHaveCount(0);
  await openFilter(page, "Skills");
  const clearSkills = skills.getByRole("button", { name: "Clear skills" });
  await clearSkills.click();
  await expect(
    page.getByRole("button", { name: "Remove language: Python", exact: true }),
  ).toBeVisible();
  await expect(clearSkills).toBeDisabled();
  await expect(headings).toHaveText(["Note of the Day"]);
  await openFilter(page, "Languages");
  await languages.getByRole("button", { name: "Clear languages" }).click();
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
  await page
    .getByRole("button", { name: "Filter by languages", exact: true })
    .focus();
  await page.keyboard.press("ArrowDown");
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
  await expect
    .poll(() =>
      swift.evaluate((element) => getComputedStyle(element).backgroundColor),
    )
    .not.toBe(background);
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
