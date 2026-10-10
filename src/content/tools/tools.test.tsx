import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { Route, Routes } from "react-router-dom";
import ToolPage from "@/pages/tools/ToolPage";
import { toolPages, toolsBySlug } from ".";

const render = (slug: string) =>
  renderToString(
    <HelmetProvider context={{}}>
      <StaticRouter location={`/tools/${slug}`}>
        <Routes>
          <Route path="/tools/:slug" element={<ToolPage />} />
        </Routes>
      </StaticRouter>
    </HelmetProvider>,
  );

const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/<!-- -->/g, "");

describe.each(toolPages.map((t) => [t.slug, t] as const))("%s", (slug, tool) => {
  it("renders the expected default result server-side", () => {
    expect(tool.expectedDefaultResult).not.toBe("");
    expect(decode(render(slug))).toContain(tool.expectedDefaultResult);
  });

  it("has a valid config", () => {
    expect(tool.title.length).toBeLessThanOrEqual(65);
    expect(tool.metaDescription.length).toBeGreaterThanOrEqual(120);
    expect(tool.metaDescription.length).toBeLessThanOrEqual(165);
    const words = tool.intro.split(/\s+/).length;
    expect(words).toBeGreaterThanOrEqual(35);
    expect(words).toBeLessThanOrEqual(65);
    expect(tool.sections.length).toBeGreaterThanOrEqual(7);
    expect(tool.faqs.length).toBeGreaterThanOrEqual(5);
    expect(tool.relatedTools).not.toContain(slug);
    for (const r of tool.relatedTools) expect(toolsBySlug.has(r), `unknown related tool ${r}`).toBe(true);
    if (tool.nextStep) expect(toolsBySlug.has(tool.nextStep.slug)).toBe(true);
    expect(`${tool.title} ${tool.metaDescription} ${tool.intro}`).not.toMatch(/\b20(1\d|2[0-5])\b/);
  });
});
