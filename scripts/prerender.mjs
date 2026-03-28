import { execSync } from "child_process";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// 1. Client build
console.log("[prerender] Building client...");
execSync("npx vite build", { stdio: "inherit", cwd: root });

// 2. SSR build
console.log("[prerender] Building SSR bundle...");
execSync(
  "npx vite build --ssr src/entry-server.tsx --outDir dist/server",
  { stdio: "inherit", cwd: root }
);

// 3. Import SSR module
const { render, staticPaths, dynamicPaths } = await import(
  resolve(root, "dist/server/entry-server.js")
);

// 4. Template from client build
const template = readFileSync(resolve(root, "dist/index.html"), "utf-8");

// Strip default meta from template to avoid duplicates with per-page helmet output
const cleanTemplate = template
  .replace(/<title>[^<]*<\/title>/, "")
  .replace(/<meta name="description"[^>]*>/, "")
  .replace(/<meta property="og:title"[^>]*>/, "")
  .replace(/<meta property="og:description"[^>]*>/, "")
  .replace(/<meta property="og:type"[^>]*>/, "");

// 5. Render each path
const allPaths = [...staticPaths, ...dynamicPaths];
console.log(`[prerender] Rendering ${allPaths.length} pages...`);

for (const url of allPaths) {
  const { html, helmet } = render(url);

  const headTags = [
    helmet?.title?.toString() ?? "",
    helmet?.meta?.toString() ?? "",
    helmet?.link?.toString() ?? "",
    helmet?.script?.toString() ?? "",
  ]
    .filter(Boolean)
    .join("\n");

  const page = cleanTemplate
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
    .replace("</head>", `${headTags}\n</head>`);

  const filePath =
    url === "/"
      ? resolve(root, "dist/index.html")
      : resolve(root, `dist${url}.html`);

  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, page);
}

// 6. Cleanup SSR bundle
rmSync(resolve(root, "dist/server"), { recursive: true, force: true });

console.log(`[prerender] Done — ${allPaths.length} pages written`);
