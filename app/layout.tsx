import type { Metadata } from "next";
import { Cormorant_Garamond, Josefin_Sans } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const josefinSans = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const cormorantDisplay = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "MurphsLife Foundation",
    template: "%s · MurphsLife Foundation",
  },
  description:
    "MurphsLife Foundation advances food sovereignty through regenerative farming, on-land education, and community rooted in El Salvador and partner regions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${josefinSans.variable} ${cormorantDisplay.variable} h-full scroll-smooth antialiased`}
    >
      <body className="font-sans text-foliage flex min-h-full flex-col bg-creme">
        {children}
      </body>
    </html>
  );
}
