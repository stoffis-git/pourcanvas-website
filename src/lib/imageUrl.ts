const CF_BASE = "https://images.pourcanvas.com/";

/**
 * Returns a Cloudflare Image Resizing URL for images hosted on images.pourcanvas.com.
 * Falls back to the original URL for external images (fal.media, etc.).
 * Requires Cloudflare Pro or CF Images product to be active on the zone.
 */
export function cfImage(url: string, width: number, quality = 82): string {
  if (!url.startsWith(CF_BASE)) return url;
  const path = url.slice(CF_BASE.length);
  return `${CF_BASE}cdn-cgi/image/width=${width},format=webp,quality=${quality}/${path}`;
}
