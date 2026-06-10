import { Link } from "react-router-dom";

const columns: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Patios", to: "/patio" },
      { label: "Driveways", to: "/driveway" },
      { label: "Walkways", to: "/walkway" },
      { label: "Blog", to: "/blog" },
      { label: "Concrete Materials", to: "/materials" },
    ],
  },
  {
    title: "Design Guides",
    links: [
      { label: "Concrete Patio Guide", to: "/guides/concrete-patio" },
      { label: "Concrete Driveway Guide", to: "/guides/concrete-driveway" },
      { label: "Concrete Walkway Guide", to: "/guides/concrete-walkway" },
    ],
  },
  {
    title: "Popular Finishes",
    links: [
      { label: "Stamped Concrete", to: "/materials/stamped-concrete" },
      { label: "Exposed Aggregate", to: "/materials/exposed-aggregate" },
      { label: "Broom Finish", to: "/materials/broom-finish" },
      { label: "Colored Concrete", to: "/materials/colored-concrete" },
      { label: "Concrete Pavers", to: "/materials/concrete-pavers" },
      { label: "Flagstone", to: "/materials/flagstone" },
    ],
  },
  {
    title: "Popular Reads",
    links: [
      { label: "Driveway Design Ideas", to: "/blog/driveway/modern-driveway-ideas" },
      { label: "Flagstone vs Concrete", to: "/blog/walkway/flagstone-vs-concrete-walkway" },
      { label: "Black Concrete Driveway", to: "/blog/driveway/black-concrete-driveway" },
      { label: "Concrete Driveway Cost", to: "/blog/driveway/concrete-driveway-cost" },
      { label: "Concrete Walkway Cost", to: "/blog/walkway/concrete-walkway-cost" },
      { label: "Best Patio Colors", to: "/blog/patio/patio-color-ideas" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* Brand + CTA */}
          <div className="max-w-xs">
            <Link to="/" className="font-display text-lg font-semibold text-foreground lowercase">
              pourcanvas
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              See your patio, driveway, or backyard redesigned in real concrete finishes —
              before you spend a cent.
            </p>
            <a
              href="/#redesign"
              className="mt-4 inline-block rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #90d1bf, #9dde90)", color: "#2d2a26" }}
            >
              Try the visualizer →
            </a>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border/60 pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PourCanvas. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
