import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/animations/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Startup Diagnostic | Authoritative Idea Assessment",
  description: "Most startup ideas fail because nobody actually wants them. Get a cold, hard diagnostic of your business idea.",
  openGraph: {
    title: "Startup Diagnostic | Authoritative Idea Assessment",
    description: "Get a cold, hard diagnostic of your business idea. Stop building what nobody wants.",
    url: "https://startup-diagnostic.com",
    siteName: "Startup Diagnostic",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Startup Diagnostic Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Diagnostic | Authoritative Idea Assessment",
    description: "Get a cold, hard diagnostic of your business idea. Stop building what nobody wants.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://startup-diagnostic.com"),
};

import { ToastProvider } from "@/components/ui/Toaster";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { BrandingProvider } from "@/components/providers/BrandingProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden`}>
        <div className="fixed inset-0 z-[-1] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="fixed inset-0 z-[-2] bg-background" />
        <CustomCursor />
        <ToastProvider>
          <BrandingProvider>
            <SmoothScroll>
              <main className="min-h-screen">
                {children}
              </main>
            </SmoothScroll>
          </BrandingProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
