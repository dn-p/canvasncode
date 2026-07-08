import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/Chatbot";

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
      <body className={`${inter.className} bg-white text-slate-900`}>
        {children}
        <Chatbot />
      </body>
    </html>
  );
}