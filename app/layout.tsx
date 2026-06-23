import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // 1. Import Footer di sini

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Canvas & Code",
  description: "Solusi Digital Pintar untuk UMKM & Bisnis F&B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} bg-white text-slate-900 flex flex-col min-h-screen`}>
        {/* Navbar di atas */}
        <Navbar />
        
        {/* Konten Utama di tengah */}
        <div className="flex-grow">
          {children}
        </div>
        
        {/* 2. Pasang Footer di paling bawah */}
        <Footer />
      </body>
    </html>
  );
}