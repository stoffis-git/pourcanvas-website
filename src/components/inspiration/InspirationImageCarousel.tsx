import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { cfImage } from "@/lib/imageUrl";

interface ImageItem {
  url: string;
  alt: string;
}

interface Props {
  images: ImageItem[];
  headline: string;
  dominantColor?: string;
}

export const InspirationImageCarousel = ({ images, headline, dominantColor }: Props) => {
  const [searchParams] = useSearchParams();
  const imageParam = parseInt(searchParams.get("image") ?? "1", 10);
  const initialIndex = Math.max(0, Math.min(imageParam - 1, images.length - 1));
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const selected = images[selectedIndex];
  const isMulti = images.length >= 2;

  return (
    <div className="w-full">
      <div
        className="relative w-full aspect-[2/3] overflow-hidden rounded-2xl select-none"
        style={{ backgroundColor: dominantColor ?? "#e5e0d8" }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {selected?.url?.startsWith("https://") && (
          <img
            src={cfImage(selected.url, 900)}
            srcSet={`${cfImage(selected.url, 450)} 450w, ${cfImage(selected.url, 900)} 900w`}
            sizes="(max-width: 768px) 100vw, 896px"
            alt={selected.alt}
            draggable={false}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        )}
        <div className="absolute inset-0 z-10" />
      </div>

      {isMulti && (
        <div className="flex flex-row flex-wrap gap-2 mt-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-opacity ${
                i === selectedIndex
                  ? "ring-2 ring-stone-800 opacity-100"
                  : "opacity-50 hover:opacity-80"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              {img.url?.startsWith("https://") && (
                <img
                  src={cfImage(img.url, 128)}
                  alt={img.alt}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover pointer-events-none"
                />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 md:hidden">
        <h1 className="text-3xl font-display font-bold text-foreground leading-tight">
          {headline}
        </h1>
      </div>
    </div>
  );
};
