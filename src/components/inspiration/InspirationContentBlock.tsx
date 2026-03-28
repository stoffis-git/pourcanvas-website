interface InspirationContentBlockProps {
  body: string;
}

export const InspirationContentBlock = ({ body }: InspirationContentBlockProps) => (
  <div className="prose prose-gray dark:prose-invert max-w-none space-y-4">
    {body.split("\n\n").map((para, i) => (
      <p key={i} className="text-base md:text-lg font-body text-foreground/80 leading-relaxed">
        {para}
      </p>
    ))}
  </div>
);
