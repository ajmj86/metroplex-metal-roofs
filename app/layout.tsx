import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ScrollReset from "@/components/ScrollReset";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Metroplex Metal Roofs | Premium Metal Roofing Dallas–Fort Worth',
  description: 'Standing seam metal roofing for DFW homeowners. 50-year lifespan, Class 4 hail rating, up to 35% insurance discount. Licensed & insured installers.',
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
      <body className="min-h-full flex flex-col">
        <ScrollReset />
        {children}
      </body>
    </html>
  );
}
