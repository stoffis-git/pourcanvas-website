import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">
        <a href="/">
          <img src="/patiocanvas_logo-full.png" alt="PourCanvas" className="h-8 w-auto" />
        </a>

        <nav className="hidden md:flex items-center gap-2">
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-full px-4 py-2 transition-all duration-200">How It Works</a>
          <a href="#projects" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-full px-4 py-2 transition-all duration-200">Projects</a>
          <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-full px-4 py-2 transition-all duration-200">Blog</Link>
          <Link to="/materials" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-full px-4 py-2 transition-all duration-200">Materials</Link>
          <Button
            size="sm"
            className="rounded-full px-6 font-semibold text-sm border-0 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #90d1bf, #9dde90)", color: "#2d2a26" }}
          >
            Get Inspired
          </Button>
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
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border px-5 py-4 flex flex-col gap-2">
          <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-xl px-3 py-2 transition-all">How It Works</a>
          <a href="#projects" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-xl px-3 py-2 transition-all">Projects</a>
          <Link to="/blog" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-xl px-3 py-2 transition-all">Blog</Link>
          <Link to="/materials" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-xl px-3 py-2 transition-all">Materials</Link>
          <Button
            size="sm"
            className="rounded-full w-full mt-2 font-semibold border-0 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #90d1bf, #9dde90)", color: "#2d2a26" }}
          >
            Get Inspired
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
