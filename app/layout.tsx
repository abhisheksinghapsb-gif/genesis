import type { Metadata } from "next";
import { Geist, Geist_Mono, Bangers, Lilita_One } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bangers = Bangers({
  variable: "--font-bangers",
  weight: "400",
  subsets: ["latin"],
});

const lilitaOne = Lilita_One({
  variable: "--font-lilita",
  weight: "400",
  subsets: ["latin"],
});

import ClientCleanup from "./components/ClientCleanup";

export const metadata: Metadata = {
  title: "GENESIS — Brawl Stars Club Tournament | GDAI",
  description:
    "The official Genesis Brawl Stars Tournament hosted by GDAI Club. Compete in 3v3 showdowns, win legendary prizes, and claim the Genesis Cup!",
  keywords: ["Genesis", "GDAI", "Brawl Stars", "Tournament", "Esports", "Gaming Club"],
  other: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bangers.variable} ${lilitaOne.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#030015] text-white selection:bg-amber-500 selection:text-black">
        <ClientCleanup />
        {children}
      </body>
    </html>
  );
}

