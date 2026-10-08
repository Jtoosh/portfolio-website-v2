import type { Page } from "@playwright/test";
import { expect, test } from "./website-test";

const retrievedAt = "2026-10-06T17:47:27.575468Z";
const now = "2026-10-06T20:00:00.000Z";
const commit = (
  digit: string,
  message: string,
  login = "Jtoosh",
  repository = "another-owner/community",
) => ({
  sha: digit.repeat(40),
  author: { login, type: "User" },
  committer: { login, type: "User" },
  repository: { full_name: repository, private: false },
  commit: {
    message,
    author: { date: "2026-10-06T19:00:00Z", name: login },
    committer: { name: login },
  },
  html_url: `https://github.com/${repository}/commit/${digit.repeat(40)}`,
});
const malformed = commit("d", "Malformed contribution");
const malformedResponses = {
  "invalid commit date": {
    ...malformed,
    commit: { ...malformed.commit, author: { date: "not a date" } },
  },
  "missing commit message": {
    ...malformed,
    commit: { author: malformed.commit.author },
  },
  "invalid commit SHA": { ...malformed, sha: "invalid" },
  "invalid commit destination": {
    ...malformed,
    html_url: "https://example.com",
  },
  "invalid commit repository": {
    ...malformed,
    repository: { full_name: "invalid", private: false },
  },
  "invalid commit author": { ...malformed, author: {} },
  "invalid repository visibility": {
    ...malformed,
    repository: { full_name: malformed.repository.full_name },
  },
};
const response = {
  total_count: 6,
  incomplete_results: false,
  items: [
    commit("a", "Community contribution\nDetails"),
    commit("a", "Community contribution"),
    commit("b", "Other person's change", "someone-else"),
    commit("c", "Automation\nGenerated-by: github-actions[bot]"),
    { ...commit("d", "Unlinked identity"), author: null },
    {
      ...commit("e", "Private contribution"),
      repository: { full_name: "another-owner/community", private: true },
    },
  ],
};
const activity = (page: Page) =>
  page.getByRole("region", { name: "Recent activity" });

test("an old snapshot stays readable while eligible public activity refreshes in the background", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date(now));
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  let requested = false;
  await page.route("https://api.github.com/**", async (route) => {
    requested = true;
    expect(route.request().url()).toContain("author%3AJtoosh%20is%3Apublic");
    await held;
    await route.fulfill({ json: response });
  });
  await page.goto("/");
  await expect(activity(page).getByRole("link").first()).toHaveText(
    "feat: support workout category focusing",
  );
  await expect.poll(() => requested).toBe(true);
  release();
  await expect(activity(page).getByRole("link")).toHaveText([
    "Community contribution",
  ]);
  await expect(activity(page)).toContainText("another-owner/community");
  await expect(activity(page).locator("time").last()).toHaveAttribute(
    "datetime",
    now,
  );
});

test("a successful cache survives visits, suppresses refresh through exactly one hour, then refreshes without hiding it", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date(now));
  let requests = 0;
  await page.route("https://api.github.com/**", (route) => {
    requests++;
    return route.fulfill({ json: response });
  });
  await page.goto("/");
  await expect(activity(page).getByRole("link")).toHaveText([
    "Community contribution",
  ]);
  for (const time of ["2026-10-06T20:30:00Z", "2026-10-06T21:00:00Z"]) {
    await page.clock.setFixedTime(new Date(time));
    await page.reload();
    await expect(activity(page).getByRole("link")).toHaveText([
      "Community contribution",
    ]);
    await page.getByRole("button", { name: "SQL", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Network Chess", exact: true }),
    ).toBeVisible();
    expect(requests).toBe(1);
    await expect(activity(page).locator("time").last()).toHaveAttribute(
      "datetime",
      now,
    );
  }
  await page.clock.setFixedTime(new Date("2026-10-06T21:00:00.001Z"));
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("https://api.github.com/**", async (route) => {
    requests++;
    await held;
    await route.fulfill({
      json: { total_count: 0, incomplete_results: false, items: [] },
    });
  });
  await page.reload();
  await expect(activity(page).getByRole("link")).toHaveText([
    "Community contribution",
  ]);
  await expect.poll(() => requests).toBe(2);
  release();
  await expect(activity(page)).toContainText(
    "No eligible public commits were found at the last retrieval.",
  );
  await expect(activity(page).locator("time").last()).toHaveAttribute(
    "datetime",
    "2026-10-06T21:00:00.001Z",
  );
});

test("a bounded timeout retains the previous results and freshness even when a late response arrives", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date(now));
  let requested = false;
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("https://api.github.com/**", async (route) => {
    requested = true;
    await held;
    await route.fulfill({ json: response }).catch(() => {});
  });
  await page.goto("/");
  await expect.poll(() => requested).toBe(true);
  await page.clock.fastForward(15_001);
  release();
  await page.getByRole("button", { name: "SQL", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Network Chess", exact: true }),
  ).toBeVisible();
  await expect(activity(page).getByRole("link").first()).toHaveText(
    "feat: support workout category focusing",
  );
  await expect(activity(page).locator("time").last()).toHaveAttribute(
    "datetime",
    retrievedAt,
  );
  await expect(
    page
      .getByRole("navigation", { name: "Contact links" })
      .getByRole("link", { name: "Email me" }),
  ).toHaveAttribute("href", "mailto:james.teuscher@outlook.com");
});

for (const failure of [
  "network",
  "rate limit",
  "invalid JSON",
  "incomplete response",
  "invalid envelope",
  ...Object.keys(malformedResponses),
] as const) {
  test(`a ${failure} preserves successful cached activity, its timestamp, and reading controls`, async ({
    page,
  }) => {
    await page.clock.setFixedTime(new Date(now));
    await page.route("https://api.github.com/**", (route) =>
      route.fulfill({ json: response }),
    );
    await page.goto("/");
    await expect(activity(page).getByRole("link")).toHaveText([
      "Community contribution",
    ]);
    await page.clock.setFixedTime(new Date("2026-10-06T22:00:00Z"));
    let completed!: () => void;
    const done = new Promise<void>((resolve) => {
      completed = resolve;
    });
    await page.route("https://api.github.com/**", async (route) => {
      if (failure === "network") await route.abort();
      else if (failure === "rate limit")
        await route.fulfill({ status: 429, json: { message: "Rate limited" } });
      else if (failure === "invalid JSON")
        await route.fulfill({
          contentType: "application/json",
          body: "broken",
        });
      else
        await route.fulfill({
          json:
            failure === "incomplete response"
              ? { ...response, incomplete_results: true }
              : failure === "invalid envelope"
                ? { items: [] }
                : {
                    total_count: 1,
                    incomplete_results: false,
                    items: Object.entries(malformedResponses)
                      .filter(([name]) => name === failure)
                      .map(([, item]) => item),
                  },
        });
      completed();
    });
    await page.reload();
    await done;
    await page.getByRole("button", { name: "SQL", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Network Chess", exact: true }),
    ).toBeVisible();
    await expect(activity(page).getByRole("link")).toHaveText([
      "Community contribution",
    ]);
    await expect(activity(page).locator("time").last()).toHaveAttribute(
      "datetime",
      now,
    );
    await expect(
      page
        .getByRole("navigation", { name: "Contact links" })
        .getByRole("link", { name: "Email me" }),
    ).toHaveAttribute("href", "mailto:james.teuscher@outlook.com");
  });
}

for (const blocked of ["read", "write", "both"] as const) {
  test(`blocked storage ${blocked} keeps the packaged fallback and permits an in-memory refresh`, async ({
    page,
  }) => {
    await page.addInitScript((mode) => {
      if (mode !== "write")
        Storage.prototype.getItem = () => {
          throw new DOMException("Blocked", "SecurityError");
        };
      if (mode !== "read")
        Storage.prototype.setItem = () => {
          throw new DOMException("Blocked", "QuotaExceededError");
        };
    }, blocked);
    await page.clock.setFixedTime(new Date(now));
    let release!: () => void;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route("https://api.github.com/**", async (route) => {
      await held;
      await route.fulfill({ json: response });
    });
    await page.goto("/");
    await expect(activity(page).getByRole("link").first()).toHaveText(
      "feat: support workout category focusing",
    );
    release();
    await expect(activity(page).getByRole("link")).toHaveText([
      "Community contribution",
    ]);
    await expect(activity(page).locator("time").last()).toHaveAttribute(
      "datetime",
      now,
    );
    await page.getByRole("button", { name: "SQL", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Network Chess", exact: true }),
    ).toBeVisible();
  });
}

for (const unusable of [
  "invalid JSON",
  "invalid records",
  "future timestamp",
] as const) {
  test(`an unusable cache with ${unusable} falls back to packaged activity and refreshes`, async ({
    page,
  }) => {
    await page.clock.setFixedTime(new Date(now));
    await page.route("https://api.github.com/**", (route) =>
      route.fulfill({ json: response }),
    );
    await page.goto("/");
    await expect(activity(page).getByRole("link")).toHaveText([
      "Community contribution",
    ]);
    if (unusable === "future timestamp") {
      // Move the visitor's clock behind the previous successful retrieval.
      await page.clock.setFixedTime(new Date("2026-10-06T19:00:00Z"));
    } else {
      // Corrupt this site's stored data; do not depend on its key or schema.
      await page.evaluate((mode) => {
        for (const key of Object.keys(localStorage))
          localStorage.setItem(
            key,
            mode === "invalid JSON"
              ? "broken"
              : JSON.stringify({ malformed: true }),
          );
      }, unusable);
    }
    let requested = false;
    let release!: () => void;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route("https://api.github.com/**", async (route) => {
      requested = true;
      await held;
      await route.fulfill({
        json: { total_count: 0, incomplete_results: false, items: [] },
      });
    });
    await page.reload();
    await expect(activity(page).getByRole("link").first()).toHaveText(
      "feat: support workout category focusing",
    );
    await expect(activity(page).locator("time").last()).toHaveAttribute(
      "datetime",
      retrievedAt,
    );
    await expect.poll(() => requested).toBe(true);
    release();
    await expect(activity(page)).toContainText(
      "No eligible public commits were found at the last retrieval.",
    );
  });
}

for (const age of [3_599_999, 3_600_000]) {
  test(`the packaged snapshot needs no refresh at age ${age} milliseconds`, async ({
    page,
  }) => {
    await page.clock.setFixedTime(new Date(Date.parse(retrievedAt) + age));
    let requests = 0;
    await page.route("https://api.github.com/**", (route) => {
      requests++;
      return route.fulfill({ json: response });
    });
    await page.goto("/");
    await page.getByRole("button", { name: "SQL", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Network Chess", exact: true }),
    ).toBeVisible();
    await expect(activity(page).getByRole("link").first()).toHaveText(
      "feat: support workout category focusing",
    );
    expect(requests).toBe(0);
  });
}
