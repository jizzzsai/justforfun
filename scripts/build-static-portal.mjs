import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transformAsync } from "@babel/core";
import presetEnv from "@babel/preset-env";
import presetReact from "@babel/preset-react";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const frontend = path.join(root, "au-rgms", "frontend");
const entries = [
  "shared-website-parts.jsx",
  "researcher-pages.jsx",
  "dean-and-faculty-review-pages.jsx",
  "role-dashboards.jsx",
  "forms-and-templates-page.jsx",
  "website-login-layout-and-navigation.jsx",
  "researcher-ai-assistant.jsx",
];

for (const entry of entries) {
  const input = path.join(frontend, entry);
  const output = path.join(frontend, entry.replace(/\.jsx$/i, ".js"));
  const source = await readFile(input, "utf8");
  const result = await transformAsync(source, {
    filename: input,
    sourceType: "script",
    comments: false,
    compact: false,
    presets: [
      [presetEnv, { targets: { ie: "11" }, modules: false }],
      [presetReact, { runtime: "classic" }],
    ],
  });
  await writeFile(output, `${result.code}\n`, "utf8");
  console.log(`Built ${path.relative(root, output)}`);
}
