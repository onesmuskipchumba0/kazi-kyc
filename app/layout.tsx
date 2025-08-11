import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KaziKYC",
  description: "Find jobs easily and securely",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="corporate">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-200 min-h-screen`}>
          <Navbar />
          {/* Content wrapper adjusts for sidebar and topbar */}
          <main className="pt-16 lg:pt-8 px-4 lg:ml-[280px] max-w-7xl mx-auto w-full">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
