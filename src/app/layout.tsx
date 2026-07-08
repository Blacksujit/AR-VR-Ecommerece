import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AIChatBot from "@/components/ai/AIChatBot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "NeoVerse Store - The Future of Shopping",
  description:
    "Experience the next generation of online shopping with AR/VR technology. Browse products in immersive 3D environments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(inter.variable, spaceGrotesk.variable, "h-full antialiased")}
    >
      <body className="min-h-full flex flex-col grid-bg noise-bg">
        <Providers>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
          <AIChatBot />
        </Providers>
      </body>
    </html>
  );
}