import { readdirSync, writeFileSync } from "fs";
import { join, relative } from "path";

const BASE_URL = "https://pourcanvas.com";
const DIST_DIR = "dist";

function collectHtmlFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectHtmlFiles(full));
    } else if (entry.name.endsWith(".html")) {
      results.push(full);
    }
  }
  return results;
}

function htmlToUrl(filePath) {
  const rel = relative(DIST_DIR, filePath);
  if (rel === "index.html") return "/";
  return "/" + rel.replace(/\.html$/, "");
}

function priority(url) {
  if (url === "/") return "1.0";
  if (url.startsWith("/inspiration/")) return "0.6";
  const depth = url.split("/").filter(Boolean).length;
  return depth === 1 ? "0.8" : "0.7";
}

function changefreq(url) {
  const depth = url.split("/").filter(Boolean).length;
  return depth <= 1 ? "weekly" : "monthly";
}

const urls = collectHtmlFiles(DIST_DIR).map(htmlToUrl).sort();

const entries = urls
  .map(
    (url) => `  <url>
    <loc>${BASE_URL}${url}</loc>
    <changefreq>${changefreq(url)}</changefreq>
    <priority>${priority(url)}</priority>
  </url>`
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;

writeFileSync(join(DIST_DIR, "sitemap.xml"), xml);
writeFileSync("public/sitemap.xml", xml);

console.log(`[sitemap] ${urls.length} URLs written to dist/sitemap.xml`);
