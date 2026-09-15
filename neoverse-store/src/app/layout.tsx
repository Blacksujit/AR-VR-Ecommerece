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
  title: "NeoVerse Store — See it before it arrives",
  description:
    "Inspect furniture, home objects, and design-led technology in 3D or AR before you buy.",
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
      <body className="min-h-full flex flex-col">
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
