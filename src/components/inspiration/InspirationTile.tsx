import { Link } from "react-router-dom";

interface InspirationTileProps {
  slug: string;
  ogImage: string;
  heroAlt: string;
  headline: string;
}

export const InspirationTile = ({ slug, ogImage, heroAlt, headline }: InspirationTileProps) => (
  <Link
    to={`/inspiration/${slug}`}
    className="group block rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
  >
    <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl">
      {ogImage.startsWith("https://") ? (
        <img src={ogImage} alt={heroAlt} className="w-full h-full object-cover" draggable={false} />
      ) : (
        <div className="w-full h-full bg-muted" />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-3 pt-10 pb-3 rounded-b-xl">
        <p className="text-base font-body font-semibold text-white leading-snug line-clamp-2">
          {headline}
        </p>
      </div>
    </div>
  </Link>
);
