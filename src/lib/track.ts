declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string | number | boolean>) => void };
  }
}

export function track(event: string, data?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  window.umami?.track(event, data);
}
