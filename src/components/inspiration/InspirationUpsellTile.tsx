interface InspirationUpsellTileProps {
  headline: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const InspirationUpsellTile = ({
  headline,
  body,
  ctaLabel = "Try PourCanvas Free",
  ctaHref = "/",
}: InspirationUpsellTileProps) => (
  <div className="rounded-2xl bg-primary/10 border border-primary/20 px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row md:items-center gap-6">
    <div className="flex-1">
      <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">{headline}</h2>
      <p className="text-sm md:text-base font-body text-muted-foreground">{body}</p>
    </div>
    <a
      href={ctaHref}
      className="inline-block shrink-0 bg-primary text-primary-foreground font-body font-semibold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors text-sm text-center"
    >
      {ctaLabel}
    </a>
  </div>
);
