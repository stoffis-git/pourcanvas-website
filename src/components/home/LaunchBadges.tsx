/**
 * Launch-platform badges, homepage only (never sitewide). Markup and rel are kept as each
 * platform issued them: their verifiers check the served HTML. Tracker: _planning/launch-2026-10/.
 */
const badges: { href: string; src: string; alt: string; width: number; height: number; kitty?: boolean }[] = [
  { href: "https://kittylaunch.com/p/pourcanvas?utm_source=badge", src: "https://kittylaunch.com/api/public/badges/launch_badge.svg?style=pill&theme=light", alt: "PourCanvas — Verified by KittyLaunch", width: 296, height: 76, kitty: true },
  { href: "https://neeed.directory/products/pourcanvas?utm_source=pourcanvas", src: "https://neeed.directory/badges/neeed-badge-light.svg", alt: "Featured on neeed.directory", width: 139, height: 20 },
  { href: "https://www.tinyshelf.co", src: "https://www.tinyshelf.co/badge/tinyshelf-badge-light-5ca4026a.svg", alt: "Featured on TinyShelf", width: 216, height: 64 },
  { href: "https://twelve.tools", src: "https://twelve.tools/badge0-white.svg", alt: "Featured on Twelve Tools", width: 148, height: 40 },
  { href: "https://nicklaunches.com/products/pourcanvas/", src: "https://nicklaunches.com/badges/featured.png", alt: "PourCanvas on Nick Launches", width: 244, height: 56 },
  { href: "https://startupfa.st", src: "https://startupfa.st/images/badges/powered-by-light.svg", alt: "Powered by Startup Fast", width: 150, height: 44 },
];

const LaunchBadges = () => (
  <section className="px-5 py-10 border-t border-border/50" aria-label="Featured on">
    <ul className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-6">
      {badges.map((b) => (
        <li key={b.href}>
          <a href={b.href} target="_blank" rel="noopener" title={b.alt}>
            <img src={b.src} alt={b.alt} width={b.width} height={b.height} loading="lazy" style={{ height: Math.min(b.height, 48), width: "auto" }} {...(b.kitty ? { "data-kittylaunch-badge": "1" } : {})} />
          </a>
        </li>
      ))}
      <li>
        <a
          href="https://launched.tools/tools/pourcanvas"
          target="_blank"
          rel="noopener"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFFFFF", border: "1px solid #D4D7C9", borderRadius: 10, padding: "8px 12px", textDecoration: "none", fontFamily: "sans-serif" }}
        >
          <span style={{ width: 22, height: 22, borderRadius: 6, background: "#C6F94E", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" viewBox="128 120 264 264">
              <path d="M214 120 L392 120 L392 298 Z" fill="#15170F" />
              <path d="M156 356 L322 190" stroke="#15170F" strokeWidth={78} fill="none" />
            </svg>
          </span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
            <span style={{ fontWeight: 700, fontSize: 12, color: "#15170F" }}>Featured on launched.tools</span>
            <span style={{ fontSize: 10, color: "#878C79" }}>REVIEWED ✓</span>
          </span>
        </a>
      </li>
    </ul>
  </section>
);

export default LaunchBadges;
