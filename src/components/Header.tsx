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
          <img src="/patiocanvas_logo-full.png" alt="PatioCanvas" className="h-8 w-auto" />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#projects" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">Projects</a>
          <Link to="/blog" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
          <Link to="/materials" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">Materials</Link>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-body rounded-full px-6">
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
        <div className="md:hidden bg-background border-t border-border px-5 py-4 flex flex-col gap-4">
          <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="text-sm font-body text-muted-foreground">How It Works</a>
          <a href="#projects" onClick={() => setMobileOpen(false)} className="text-sm font-body text-muted-foreground">Projects</a>
          <Link to="/blog" onClick={() => setMobileOpen(false)} className="text-sm font-body text-muted-foreground">Blog</Link>
          <Link to="/materials" onClick={() => setMobileOpen(false)} className="text-sm font-body text-muted-foreground">Materials</Link>
          <Button size="sm" className="bg-primary text-primary-foreground font-body rounded-full w-full">
            Get Inspired
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
