import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Josefin_Sans } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const josefinSans = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

const cormorantDisplay = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2c342d" },
    { media: "(prefers-color-scheme: dark)", color: "#2c342d" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "MurphsLife Foundation",
    template: "%s · MurphsLife Foundation",
  },
  description:
    "MurphsLife Foundation advances food sovereignty through regenerative farming, on-land education, and community rooted in El Salvador and partner regions.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sovereignty Summit",
  },
  formatDetection: {
    telephone: false,
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
      className={`${josefinSans.variable} ${cormorantDisplay.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        {/* Preconnect to external asset CDN for faster hero image load */}
        <link rel="preconnect" href="https://assets.murphslifefoundation.com" />
        <link rel="dns-prefetch" href="https://assets.murphslifefoundation.com" />
        {/* Preconnect to Google Fonts (already loaded by next/font but belt-and-suspenders) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Apple Touch Icon for iOS home screen */}
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />
      </head>
      <body className="font-sans text-foliage flex min-h-full flex-col bg-creme">
        {children}
      </body>
    </html>
  );
}
