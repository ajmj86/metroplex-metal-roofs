import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import ScrollReset from "@/components/ScrollReset";
import UTMCapture from "@/components/UTMCapture";
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
  title: 'Metroplex Metal Roofs | Luxury Metal Roofing Dallas–Fort Worth',
  description: 'Standing seam and stone-coated steel for DFW homeowners ready to stop replacing their roof. Satellite estimates. Credentialed installers. The last roof you\'ll ever need.',
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
        <style>{`
     html { overflow-y: scroll; }
     body { overflow-x: hidden; scrollbar-width: thin; scrollbar-color: #27272A #09090A; }
     ::-webkit-scrollbar { width: 6px; }
     ::-webkit-scrollbar-track { background: #09090A; }
     ::-webkit-scrollbar-thumb { background: #27272A; border-radius: 3px; }
   `}</style>
        <ScrollReset />
        <Suspense fallback={null}>
          <UTMCapture />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
