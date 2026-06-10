const stats = [
  "50,000+ spaces reimagined",
  "3 free designs / day",
  "No sign-up required",
];

const SocialProofBar = () => (
  <div className="bg-muted/40 border-y border-border/50 py-4">
    <div className="max-w-6xl mx-auto px-5 flex items-center justify-center flex-wrap gap-x-6 gap-y-2">
      {stats.map((stat, i) => (
        <span key={i} className="text-sm font-medium text-muted-foreground">
          {stat}
        </span>
      ))}
    </div>
  </div>
);

export default SocialProofBar;
