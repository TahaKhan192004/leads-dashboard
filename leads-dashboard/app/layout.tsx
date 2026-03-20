import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadRadar — Google Maps Lead Intelligence",
  description: "Scrape, enrich, and manage Google Maps leads with AI context",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
