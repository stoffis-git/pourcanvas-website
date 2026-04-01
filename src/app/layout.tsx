import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "PourCanvas — Patio Inspiration",
  description: "Upload a photo of your patio and see how it could look redesigned.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">
        {children}
        <Script src="https://analytics.ahrefs.com/analytics.js" data-key="GhwRc2/2uuli+syFv4EX8Q" strategy="afterInteractive" />
      </body>
    </html>
  );
}
