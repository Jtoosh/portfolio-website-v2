import type { Page } from "@playwright/test";

export async function openFilter(page: Page, title: "Skills" | "Languages") {
  const section = page.getByRole("region", { name: title, exact: true });
  const trigger = section.getByRole("button", {
    name: `Filter by ${title.toLowerCase()}`,
    exact: true,
  });
  if ((await trigger.getAttribute("aria-expanded")) !== "true")
    await trigger.click();
  return section;
}
