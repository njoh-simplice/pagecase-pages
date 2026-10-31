import type { Metadata, Viewport } from "next";
import { Anton, Kode_Mono } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { author, keywords, portfolioUrl } from "@/lib/content";
import { siteUrl } from "@/lib/jsonld";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const kodeMono = Kode_Mono({
  variable: "--font-kode-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#5b2333",
};

export const metadata: Metadata = {
  ...(siteUrl && { metadataBase: new URL(siteUrl) }),
  applicationName: "NSAGENCY",
  title: {
    default: "NSAGENCY | Software, Communication & Consulting in Cameroon",
    template: "%s | NSAGENCY",
  },
  description:
    "NSAGENCY is a software development, communication and consulting agency based in Yaoundé, Cameroon.",
  keywords,
  authors: [{ name: author, url: portfolioUrl }],
  creator: author,
  category: "technology",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${kodeMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
