import { readFile, writeFile, rm } from "node:fs/promises";
import { html } from "../.prerender/prerender.js";

const template = await readFile("dist/index.html", "utf8");
if (!template.includes("<!--portfolio-html-->")) {
  throw new Error(
    "The generated HTML is missing its portfolio insertion point.",
  );
}
await writeFile(
  "dist/index.html",
  template.replace("<!--portfolio-html-->", html),
);
await rm(".prerender", { recursive: true, force: true });
