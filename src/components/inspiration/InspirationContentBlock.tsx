interface InspirationContentBlockProps {
  body: string;
}

export const InspirationContentBlock = ({ body }: InspirationContentBlockProps) => (
  <div className="prose prose-gray dark:prose-invert max-w-none">
    <p className="text-base md:text-lg font-body text-foreground/80 leading-relaxed">{body}</p>
  </div>
);
