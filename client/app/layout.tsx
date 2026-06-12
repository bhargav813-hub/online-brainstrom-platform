import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { SocketProvider } from "@/providers/SocketProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BrainstormHub — Collaborative Ideation Platform",
    template: "%s | BrainstormHub",
  },
  description:
    "Structured online brainstorming with hierarchical ideas, real-time collaboration, and powerful voting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <SocketProvider>
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md"
                >
                  Skip to main content
                </a>
                {children}
                <Toaster position="bottom-right" richColors closeButton />
              </SocketProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
