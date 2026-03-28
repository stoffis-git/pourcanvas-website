interface InspirationHeroProps {
  image: string;
  alt: string;
  headline: string;
  subheadline?: string;
}

export const InspirationHero = ({ image, alt, headline, subheadline }: InspirationHeroProps) => (
  <div className="w-full">
    <div
      className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {image?.startsWith("https://") && (
        <img
          src={image}
          alt={alt}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      )}
      <div className="absolute inset-0 z-10" />
    </div>
    <div className="mt-6">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">
        {headline}
      </h1>
      {subheadline && (
        <p className="mt-3 text-base md:text-lg font-body text-muted-foreground">{subheadline}</p>
      )}
    </div>
  </div>
);
