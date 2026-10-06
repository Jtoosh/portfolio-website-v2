import { expect, test } from "@playwright/test";

test("the initial HTML introduces James and offers the approved reading content without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(
    page.getByRole("heading", { name: "James Teuscher", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "I'm James, a software engineer and computer science student.",
      { exact: false },
    ),
  ).toBeVisible();
  await expect(
    page.getByText("TODO: Replace this introduction with my own writing.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "TODO: Describe the motivation and vision behind what I'm working on now.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 3 })).toHaveText([
    "Exercise App",
    "Note of the Day",
    "Tweeter",
  ]);
  await expect(page.getByText("Education", { exact: true })).toBeVisible();
  await context.close();
});

test("featured projects preserve approved summaries, attribution, and repository destinations after startup", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  const articles = page.getByRole("article");
  await expect(articles).toHaveCount(3);
  await expect(articles.nth(0)).toContainText(
    "A workout planner built around my own gym routine, with workout generation, exercise logging, a rest timer, and saved workout history. I've used feedback from real workouts to refine the app and its scope.",
  );
  await expect(articles.nth(1)).toContainText(
    "An experiment in bringing small learning snippets into everyday life, including a native macOS widget scaffold. Built with extensive Codex assistance; my work involved prompting, reviewing, and testing the result.",
  );
  await expect(articles.nth(2)).toContainText(
    "A course-built social application with an AWS backend. My work included backend endpoints, asynchronous feed updates, infrastructure configuration, and debugging request handling.",
  );
  await expect(articles.nth(0).getByRole("link")).toHaveAttribute(
    "href",
    "https://github.com/Jtoosh/exercise-app",
  );
  await expect(articles.nth(1).getByRole("link")).toHaveAttribute(
    "href",
    "https://github.com/Jtoosh/note-of-the-day",
  );
  await expect(articles.nth(2).getByRole("link")).toHaveAttribute(
    "href",
    "https://github.com/Jtoosh/byu-cs340",
  );
  await expect(
    articles.nth(2).getByText("Education", { exact: true }),
  ).toBeVisible();
  await expect(
    articles.nth(0).getByText("Education", { exact: true }),
  ).toHaveCount(0);
  await expect(
    articles.nth(1).getByText("Education", { exact: true }),
  ).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("contact destinations are readable without JavaScript and email is the primary action", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  const contacts = page.getByRole("navigation", { name: "Contact links" });
  await expect(contacts.getByRole("link")).toHaveText([
    "Email me ↗",
    "Resume",
    "LinkedIn",
    "GitHub",
  ]);
  await expect(
    contacts.getByRole("link", { name: "Email me" }),
  ).toHaveAttribute("href", "mailto:james.teuscher@outlook.com");
  await expect(contacts.getByRole("link", { name: "Resume" })).toHaveAttribute(
    "href",
    "https://mega.nz/file/cJxC2CrD#r9PMHAd4utssUWPVjPUyhGsuXkUcNAIPQq3hOOZXZNA",
  );
  await expect(
    contacts.getByRole("link", { name: "LinkedIn" }),
  ).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/james-teuscher-871a69316",
  );
  await expect(contacts.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/jtoosh",
  );
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "Let's talk" }),
  ).toHaveAttribute("href", "mailto:james.teuscher@outlook.com");
  await context.close();
});

test("the reading layout adapts to small screens and system themes with visible keyboard focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const lightBackground = await page
    .locator("body")
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.emulateMedia({ colorScheme: "dark" });
  const darkBackground = await page
    .locator("body")
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(darkBackground).not.toBe(lightBackground);
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  expect(
    await skipLink.evaluate(
      (element) => getComputedStyle(element).outlineStyle,
    ),
  ).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeInViewport();
  await page.setViewportSize({ width: 1280, height: 900 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
