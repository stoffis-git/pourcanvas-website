// Writes IPTC/XMP (title, description, creator, copyright, license, keywords) into
// every JPG in image-gen/generated_images and public/studio. Requires exiftool.
// Re-upload the files to R2 afterwards.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join, basename } from "node:path";

const parseCsv = (text) => {
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c !== "\r") cell += c;
  }
  const [head, ...body] = rows;
  return body.filter((r) => r.length === head.length).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
};

const NOISE = /^(photorealistic|no people|human-eye level angle|architectural photography|sharp texture detail|\d:\d vertical|golden hour.*|soft overcast daylight|natural daylight)$/i;
const prompts = new Map();
for (const r of parseCsv(readFileSync(".claude/skills/pourcanvas-seo/pinterest-images.csv", "utf-8"))) {
  if (!r.image_filename || !r.ai_prompt) continue;
  const parts = r.ai_prompt.replace(/^photorealistic\s+/i, "").split(",").map((x) => x.trim()).filter((x) => x && !NOISE.test(x));
  const text = parts.slice(0, 2).join(", ");
  prompts.set(basename(r.image_filename), `${r.page_title}: ${text[0].toUpperCase()}${text.slice(1)}.`);
}

const DIRS = ["image-gen/generated_images", "public/studio"];

const alts = new Map();
const walk = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]
  );
for (const f of walk("src/content").filter((f) => f.endsWith(".ts"))) {
  const src = readFileSync(f, "utf-8");
  for (const m of src.matchAll(/ogImage:\s*"[^"]*\/([^"\/]+\.jpg)"[\s\S]{0,800}?heroAlt:\s*"([^"]+)"/g)) alts.set(m[1], m[2]);
  for (const m of src.matchAll(/heroAlt:\s*"([^"]+)"[\s\S]{0,800}?ogImage:\s*"[^"]*\/([^"\/]+\.jpg)"/g)) if (!alts.has(m[2])) alts.set(m[2], m[1]);
  for (const m of src.matchAll(/url:\s*"[^"]*\/([^"\/]+\.jpg)",\s*alt:\s*"([^"]+)"/g)) alts.set(m[1], m[2]);
}

const titleCase = (slug) =>
  slug.replace(/\.jpg$/, "").replace(/^(inspiration|before-after|example)-/, "").split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

let n = 0;
for (const dir of DIRS) {
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".jpg") && !f.startsWith("orbit_"))) {
    const file = basename(f);
    const title = titleCase(file);
    const desc = alts.get(file) ?? prompts.get(file) ?? (file.startsWith("premium-slab") ? "Premium poured concrete slab finish with natural texture" : title);
    const keywords = [...new Set([...title.toLowerCase().split(" ").filter((w) => w.length > 2), "concrete", "pourcanvas"])];
    execFileSync("exiftool", [
      "-overwrite_original", "-m", "-charset", "iptc=utf8", "-IPTC:CodedCharacterSet=UTF8",
      `-XMP-dc:Title=${title}`, `-IPTC:ObjectName=${title}`,
      `-XMP-dc:Description=${desc}`, `-IPTC:Caption-Abstract=${desc}`,
      "-XMP-dc:Creator=PourCanvas", "-IPTC:By-line=PourCanvas",
      "-XMP-photoshop:Credit=PourCanvas", "-IPTC:Credit=PourCanvas",
      "-XMP-dc:Rights=© PourCanvas. Licensed CC BY 4.0", "-IPTC:CopyrightNotice=© PourCanvas. Licensed CC BY 4.0",
      "-XMP-xmpRights:Marked=True",
      "-XMP-xmpRights:WebStatement=https://creativecommons.org/licenses/by/4.0/",
      "-XMP-cc:License=https://creativecommons.org/licenses/by/4.0/",
      "-XMP-iptcExt:DigitalSourceType=http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia",
      ...keywords.flatMap((k) => [`-XMP-dc:Subject=${k}`, `-IPTC:Keywords=${k}`]),
      join(dir, f),
    ]);
    n++;
  }
}
console.log(`Embedded metadata in ${n} images`);
