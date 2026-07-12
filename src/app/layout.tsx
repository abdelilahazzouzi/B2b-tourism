import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Noise } from "@/components/ui/Noise";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "Kasbarah | Premium Moroccan Tourism",
    template: "%s | Kasbarah",
  },
  description:
    "Kasbarah crafts exclusive, immersive expeditions and luxury cultural experiences across Morocco. Invitation-only. Uncompromising authenticity.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Kasbarah",
    title: "Kasbarah | Premium Moroccan Tourism",
    description:
      "Exclusive, immersive expeditions and luxury cultural experiences across Morocco. Invitation-only. Uncompromising authenticity.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kasbarah — Premium Moroccan Tourism",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kasbarah | Premium Moroccan Tourism",
    description:
      "Exclusive, immersive expeditions and luxury cultural experiences across Morocco.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-white text-navy font-sans relative">
        <Noise />
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
