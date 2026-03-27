const Footer = () => {
  return (
    <footer className="px-5 py-8 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <a href="/" className="font-display text-lg font-semibold text-foreground lowercase">
          pourcanvas
        </a>
        <p className="font-body text-xs text-muted-foreground">
          © {new Date().getFullYear()} PourCanvas. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
