import type { Metadata, Viewport } from "next";
import { Mona_Sans, Bricolage_Grotesque, Mrs_Saint_Delafield, Bodoni_Moda } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const mona = Mona_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--nf-mona", display: "swap" });
const brier = Bricolage_Grotesque({ subsets: ["latin"], variable: "--nf-brier", display: "swap" });
const serif = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], variable: "--nf-serif", display: "swap" });
const sig = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400", variable: "--nf-sig", display: "swap" });

export const metadata: Metadata = {
  title: `${site.firstName} ${site.lastName} — ${site.role}`,
  description: site.message.text,
};

export const viewport: Viewport = { themeColor: "#1e1531" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mona.variable} ${brier.variable} ${sig.variable} ${serif.variable}`}>
      <body className="is-loading">{children}</body>
    </html>
  );
}
