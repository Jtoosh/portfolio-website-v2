import { expect, test } from "./website-test";

test("the production HTML identifies James for search and sharing at his existing domain", async ({
  request,
  browser,
}) => {
  const response = await request.get("/");
  expect(response.ok()).toBe(true);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.setContent(await response.text());
  await expect(page).toHaveTitle("James Teuscher — Software engineer");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "James Teuscher's software engineering portfolio: web, backend, native apps, and infrastructure, with selected projects and current work.",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://profile.jamesteuscher.click/",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "James Teuscher — Software engineer",
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    /software engineering portfolio/,
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://profile.jamesteuscher.click/",
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "website",
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary",
  );
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
    "content",
    "James Teuscher — Software engineer",
  );
  await expect(
    page.locator('meta[name="twitter:description"]'),
  ).toHaveAttribute("content", /software engineering portfolio/);
  await expect(
    page.getByRole("heading", { name: "James Teuscher", exact: true }),
  ).toBeVisible();
  await context.close();
});

test("the production artifact serves custom-domain configuration and its own browser assets", async ({
  request,
}) => {
  const domain = await request.get("/CNAME");
  expect(domain.ok()).toBe(true);
  expect((await domain.text()).trim()).toBe("profile.jamesteuscher.click");
  const html = await (await request.get("/")).text();
  const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^" ]+)"/g)].map(
    (match) => match[1],
  );
  expect(assets.some((asset) => asset.endsWith(".js"))).toBe(true);
  expect(assets.some((asset) => asset.endsWith(".css"))).toBe(true);
  for (const asset of assets) {
    const response = await request.get(asset);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).not.toContain("text/html");
  }
});
