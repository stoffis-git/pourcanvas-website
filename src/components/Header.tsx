import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Patios", to: "/patio" },
  { label: "Driveways", to: "/driveway" },
  { label: "Walkways", to: "/walkway" },
  { label: "Blog", to: "/blog" },
  { label: "Materials", to: "/materials" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">
        <Link to="/">
          <img src="/patiocanvas_logo-full.png" alt="PourCanvas" className="h-8 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-full px-4 py-2 transition-all duration-200"
            >
              {label}
            </Link>
          ))}
          <Link to="/" className="ml-3">
            <Button
              size="sm"
              className="rounded-full px-6 font-semibold text-sm border-0 hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #90d1bf, #9dde90)", color: "#2d2a26" }}
            >
              Try It Free →
            </Button>
          </Link>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border px-5 py-5 flex flex-col gap-2">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="text-base font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-xl px-3 py-3 transition-all"
            >
              {label}
            </Link>
          ))}
          <Link to="/" onClick={() => setMobileOpen(false)} className="mt-2">
            <Button
              size="sm"
              className="rounded-full w-full font-semibold border-0 hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #90d1bf, #9dde90)", color: "#2d2a26" }}
            >
              Try It Free →
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
