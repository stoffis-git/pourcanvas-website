import { Link } from "react-router-dom";
import type { MaterialRelatedArticle } from "../../content/types";
import { articlesBySlug } from "../../content";

interface Props {
  articles: MaterialRelatedArticle[];
}

export const MaterialRelatedArticles = ({ articles }: Props) => {
  const resolved = articles
    .map((ref) => ({
      ref,
      article: articlesBySlug.get(`${ref.pillar}/${ref.slug}`),
    }))
    .filter((r): r is { ref: MaterialRelatedArticle; article: NonNullable<typeof r.article> } =>
      r.article !== undefined
    );

  if (resolved.length === 0) return null;

  return (
    <div className="mt-10 border-t pt-8">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
        Related guides
      </h3>
      <ul className="space-y-2">
        {resolved.map(({ ref, article }) => (
          <li key={`${ref.pillar}/${ref.slug}`}>
            <Link
              to={`/blog/${ref.pillar}/${ref.slug}`}
              className="text-sm text-primary hover:underline"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
