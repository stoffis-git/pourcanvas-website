import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { allMaterialPages } from "@/content";

function MaterialSwatch({ slug }: { slug: string }) {
  const s = { width: "100%", height: "100%" } as const;

  switch (slug) {
    case "stamped-concrete":
      return (
        <svg viewBox="0 0 56 56" {...s}>
          <rect width="56" height="56" fill="#caaa72" />
          <line x1="0" y1="19" x2="56" y2="19" stroke="#7a5020" strokeWidth="1.5" opacity="0.4" />
          <line x1="0" y1="38" x2="56" y2="38" stroke="#7a5020" strokeWidth="1.5" opacity="0.4" />
          <line x1="28" y1="0" x2="28" y2="19" stroke="#7a5020" strokeWidth="1.5" opacity="0.4" />
          <line x1="14" y1="19" x2="14" y2="38" stroke="#7a5020" strokeWidth="1.5" opacity="0.4" />
          <line x1="42" y1="19" x2="42" y2="38" stroke="#7a5020" strokeWidth="1.5" opacity="0.4" />
          <line x1="28" y1="38" x2="28" y2="56" stroke="#7a5020" strokeWidth="1.5" opacity="0.4" />
        </svg>
      );

    case "exposed-aggregate":
      return (
        <svg viewBox="0 0 56 56" {...s}>
          <rect width="56" height="56" fill="#b0a898" />
          <circle cx="8"  cy="10" r="3.2" fill="#595959" />
          <circle cx="22" cy="6"  r="2"   fill="#484848" />
          <circle cx="40" cy="13" r="3.5" fill="#545454" />
          <circle cx="51" cy="5"  r="2"   fill="#3e3e3e" />
          <circle cx="14" cy="24" r="2.5" fill="#505050" />
          <circle cx="34" cy="20" r="2"   fill="#404040" />
          <circle cx="49" cy="28" r="3"   fill="#565656" />
          <circle cx="5"  cy="38" r="3"   fill="#464646" />
          <circle cx="20" cy="43" r="2.5" fill="#525252" />
          <circle cx="37" cy="38" r="3.5" fill="#3c3c3c" />
          <circle cx="52" cy="45" r="2"   fill="#4e4e4e" />
          <circle cx="11" cy="52" r="3"   fill="#585858" />
          <circle cx="28" cy="50" r="2"   fill="#424242" />
          <circle cx="45" cy="54" r="2.5" fill="#4c4c4c" />
          <circle cx="27" cy="30" r="3"   fill="#4a4a4a" />
          <circle cx="3"  cy="20" r="1.5" fill="#606060" />
          <circle cx="55" cy="18" r="2"   fill="#3a3a3a" />
        </svg>
      );

    case "broom-finish":
      return (
        <svg viewBox="0 0 56 56" {...s}>
          <rect width="56" height="56" fill="#b4b4b4" />
          {Array.from({ length: 19 }, (_, i) => (
            <line
              key={i}
              x1="0" y1={i * 3} x2="56" y2={i * 3}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth={i % 3 === 0 ? 1.2 : 0.6}
            />
          ))}
          <rect width="56" height="56" fill="rgba(255,255,255,0.08)" />
        </svg>
      );

    case "colored-concrete":
      return (
        <svg viewBox="0 0 56 56" {...s}>
          <defs>
            <linearGradient id="cc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cc7a4a" />
              <stop offset="60%" stopColor="#a85c2c" />
              <stop offset="100%" stopColor="#c07040" />
            </linearGradient>
          </defs>
          <rect width="56" height="56" fill="url(#cc-grad)" />
          <rect width="56" height="56" fill="rgba(255,255,255,0.06)" />
        </svg>
      );

    case "concrete-pavers":
      return (
        <svg viewBox="0 0 56 56" {...s}>
          <rect width="56" height="56" fill="#a89060" />
          {/* Row 1 */}
          <rect x="1"  y="1"  width="26" height="16" rx="0.5" fill="#cfc0a0" stroke="#8a7048" strokeWidth="1" />
          <rect x="29" y="1"  width="26" height="16" rx="0.5" fill="#c8b898" stroke="#8a7048" strokeWidth="1" />
          {/* Row 2 (offset) */}
          <rect x="1"  y="19" width="13" height="16" rx="0.5" fill="#d4c8a8" stroke="#8a7048" strokeWidth="1" />
          <rect x="16" y="19" width="26" height="16" rx="0.5" fill="#c4b894" stroke="#8a7048" strokeWidth="1" />
          <rect x="44" y="19" width="11" height="16" rx="0.5" fill="#cbbf9a" stroke="#8a7048" strokeWidth="1" />
          {/* Row 3 */}
          <rect x="1"  y="37" width="26" height="18" rx="0.5" fill="#ccc09e" stroke="#8a7048" strokeWidth="1" />
          <rect x="29" y="37" width="26" height="18" rx="0.5" fill="#c6ba96" stroke="#8a7048" strokeWidth="1" />
        </svg>
      );

    case "flagstone":
      return (
        <svg viewBox="0 0 56 56" {...s}>
          <rect width="56" height="56" fill="#8a7a60" />
          <polygon points="0,0 33,0 31,20 0,22"   fill="#b8aa84" stroke="#7a6a50" strokeWidth="1.2" />
          <polygon points="33,0 56,0 56,25 35,22"  fill="#c8bc98" stroke="#7a6a50" strokeWidth="1.2" />
          <polygon points="0,22 31,20 29,41 0,44"  fill="#beb090" stroke="#7a6a50" strokeWidth="1.2" />
          <polygon points="31,20 56,25 54,43 29,41" fill="#d0c6a4" stroke="#7a6a50" strokeWidth="1.2" />
          <polygon points="0,44 29,41 27,56 0,56"  fill="#bcb08a" stroke="#7a6a50" strokeWidth="1.2" />
          <polygon points="29,41 54,43 56,56 27,56" fill="#c4ba94" stroke="#7a6a50" strokeWidth="1.2" />
        </svg>
      );

    case "travertine":
      return (
        <svg viewBox="0 0 56 56" {...s}>
          <rect width="56" height="56" fill="#e2d0a8" />
          {/* horizontal veining lines */}
          <path d="M0 9 Q14 7 28 10 Q42 13 56 10"  stroke="#c8b27a" strokeWidth="0.8" fill="none" opacity="0.7" />
          <path d="M0 18 Q20 15 35 19 Q46 21 56 18" stroke="#c8b27a" strokeWidth="1.2" fill="none" opacity="0.5" />
          <path d="M0 27 Q10 29 25 26 Q40 23 56 27" stroke="#c8b27a" strokeWidth="0.7" fill="none" opacity="0.6" />
          <path d="M0 36 Q16 33 30 37 Q44 40 56 36" stroke="#c8b27a" strokeWidth="1"   fill="none" opacity="0.55" />
          <path d="M0 45 Q22 48 38 44 Q48 41 56 45" stroke="#c8b27a" strokeWidth="0.8" fill="none" opacity="0.65" />
          {/* small travertine pits */}
          <ellipse cx="8"  cy="13" rx="1.5" ry="1" fill="#b09060" opacity="0.6" />
          <ellipse cx="42" cy="22" rx="2"   ry="1.2" fill="#b09060" opacity="0.5" />
          <ellipse cx="20" cy="40" rx="1.8" ry="1" fill="#b09060" opacity="0.55" />
        </svg>
      );

    case "polished-concrete":
      return (
        <svg viewBox="0 0 56 56" {...s}>
          <defs>
            <linearGradient id="pc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"  stopColor="#d8d8d8" />
              <stop offset="38%" stopColor="#a8a8a8" />
              <stop offset="55%" stopColor="#d2d2d2" />
              <stop offset="100%" stopColor="#989898" />
            </linearGradient>
          </defs>
          <rect width="56" height="56" fill="url(#pc-grad)" />
          {/* sheen highlight band */}
          <rect x="10" y="0" width="8" height="56" fill="rgba(255,255,255,0.18)" transform="skewX(-12)" />
        </svg>
      );

    case "concrete-overlay":
      return (
        <svg viewBox="0 0 56 56" {...s}>
          <defs>
            <linearGradient id="co-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"  stopColor="#686660" />
              <stop offset="55%" stopColor="#484642" />
              <stop offset="100%" stopColor="#606058" />
            </linearGradient>
          </defs>
          <rect width="56" height="56" fill="url(#co-grad)" />
          <rect width="56" height="56" fill="rgba(255,255,255,0.04)" />
        </svg>
      );

    default:
      return <rect width="56" height="56" fill="#c0b8a8" />;
  }
}

const MaterialsHub = () => (
  <>
    <SeoHead
      title="Concrete Materials Guide: Finishes, Costs & Comparisons | PourCanvas"
      description="9 outdoor concrete finishes compared — stamped ($8–20/sq ft), exposed aggregate, broom finish, colored concrete, pavers, and more. Costs, pros, and cons."
      canonical="/materials"
    />
    <Header />
    <main className="max-w-6xl mx-auto px-5 py-28 md:py-36">
      <div className="max-w-2xl mb-12">
        <p className="text-sm font-display font-medium text-muted-foreground uppercase tracking-widest mb-3">
          Materials
        </p>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight mb-4">
          Concrete Finish Guide
        </h1>
        <p className="text-base md:text-lg font-body text-muted-foreground">
          Deep-dive guides on every major outdoor concrete finish — what each one is, what it costs, and when to use it. See design ideas by surface: <Link to="/blog/patio" className="text-primary hover:underline">patio</Link>, <Link to="/blog/driveway" className="text-primary hover:underline">driveway</Link>, <Link to="/blog/walkway" className="text-primary hover:underline">walkway</Link>.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {allMaterialPages.map((material) => (
          <Link
            key={material.slug}
            to={`/materials/${material.slug}`}
            className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/40 transition-colors flex gap-5 items-start"
          >
            <div className="w-14 h-14 rounded-xl shrink-0 overflow-hidden">
              <MaterialSwatch slug={material.slug} />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {material.headline}
              </h2>
              <p className="text-sm font-body text-muted-foreground">{material.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
    <Footer />
  </>
);

export default MaterialsHub;
