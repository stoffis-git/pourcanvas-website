import { readdirSync, readFileSync, writeFileSync } from "fs";
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

function extractLastmod(html) {
  const match = html.match(/<meta[^>]*property="article:modified_time"[^>]*content="([^"]+)"/);
  return match ? match[1] : null;
}

function extractImages(html) {
  const root = html.match(/<div id="root">([\s\S]*)<\/div>/);
  const body = root ? root[1] : html;
  const urls = [...body.matchAll(/<img[^>]+src="(https:\/\/images\.pourcanvas\.com\/[^"]+)"/g)].map((m) => m[1]);
  return [...new Set(urls)].slice(0, 1000);
}

const escapeXml = (s) => s.replace(/&amp;/g, "&").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const files = collectHtmlFiles(DIST_DIR);
const urlData = files
  .map((f) => {
    const html = readFileSync(f, "utf-8");
    return { url: htmlToUrl(f), lastmod: extractLastmod(html), images: extractImages(html) };
  })
  .sort((a, b) => a.url.localeCompare(b.url));

const SECTIONS = [
  { name: "core", test: (u) => u.split("/").filter(Boolean).length <= 1 || /^\/(blog\/[^/]+|guides\/.+)$/.test(u) },
  { name: "tools", test: (u) => u.startsWith("/tools/") },
  { name: "blog", test: (u) => u.startsWith("/blog/") },
  { name: "materials", test: (u) => u.startsWith("/materials/") },
  { name: "inspiration", test: (u) => u.startsWith("/inspiration/") },
  { name: "palette", test: (u) => u.startsWith("/palette/") },
  { name: "before-after", test: (u) => u.startsWith("/before-after/") },
];

const sectionOf = (url) => (SECTIONS.find((s) => s.test(url)) ?? SECTIONS[0]).name;

const toEntry = ({ url, lastmod, images }) => `  <url>
    <loc>${BASE_URL}${url}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${changefreq(url)}</changefreq>
    <priority>${priority(url)}</priority>${images
      .map((img) => `\n    <image:image><image:loc>${escapeXml(img)}</image:loc></image:image>`)
      .join("")}
  </url>`;

const today = new Date().toISOString().split("T")[0];
const children = [];

for (const { name } of SECTIONS) {
  const items = urlData.filter((d) => d.url !== "/404" && sectionOf(d.url) === name);
  if (items.length === 0) continue;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${items.map(toEntry).join("\n")}
</urlset>
`;
  const file = `sitemap-${name}.xml`;
  writeFileSync(join(DIST_DIR, file), xml);
  writeFileSync(join("public", file), xml);
  const lastmod = items.map((d) => d.lastmod).filter(Boolean).sort().pop() ?? today;
  children.push({ file, lastmod, count: items.length });
}

const index = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${children.map((c) => `  <sitemap>\n    <loc>${BASE_URL}/${c.file}</loc>\n    <lastmod>${c.lastmod}</lastmod>\n  </sitemap>`).join("\n")}
</sitemapindex>
`;

writeFileSync(join(DIST_DIR, "sitemap.xml"), index);
writeFileSync("public/sitemap.xml", index);

console.log(`[sitemap] index + ${children.map((c) => `${c.file} (${c.count})`).join(", ")}`);
