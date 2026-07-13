import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { SocketProvider } from '@/providers/SocketProvider';
import { siteConfig } from '@/config/site';
import './globals.css';

const geistSans = Geist({ variable: '--font-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { template: `%s | ${siteConfig.name}`, default: siteConfig.name },
  description: siteConfig.description,
  openGraph: { type: 'website', images: [siteConfig.ogImage] },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon-32x32.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <SocketProvider>
              <TooltipProvider delay={200}>
                {children}
              </TooltipProvider>
            </SocketProvider>
          </AuthProvider>
        </QueryProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
