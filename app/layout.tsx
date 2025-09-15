// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import SignInComponent from "@/components/SignInComponent";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "react-hot-toast";

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
    <ClerkProvider publishableKey="pk_test_Y2FzdWFsLXNwaWRlci0yNC5jbGVyay5hY2NvdW50cy5kZXYk">
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-200 min-h-screen`}>
          <ThemeProvider>
            <SignedIn>
              <Navbar />
              {/* Content wrapper adjusts for sidebar and topbar */}
              <main className="pt-16 lg:pt-8 px-4 lg:ml-[280px] max-w-7xl mx-auto w-full">
                {children}
              </main>
            </SignedIn>
            <SignedOut>
              <SignInComponent/>
            </SignedOut>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--fallback-b1,oklch(var(--b1)))',
                  color: 'var(--fallback-bc,oklch(var(--bc)))',
                  border: '1px solid var(--fallback-b3,oklch(var(--b3)))',
                },
                success: {
                  iconTheme: {
                    primary: 'var(--fallback-su,oklch(var(--su)))',
                    secondary: 'var(--fallback-suc,oklch(var(--suc)))',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'var(--fallback-er,oklch(var(--er)))',
                    secondary: 'var(--fallback-erc,oklch(var(--erc)))',
                  },
                },
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}