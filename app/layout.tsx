import type { Metadata } from "next";
import { SpeedInsights } from '@vercel/speed-insights/next';
import "@fontsource/jetbrains-mono";
import "./globals.css";
import QueryProvider from '@/components/providers/QueryProvider';
import { GraphicsProvider } from '@/components/providers/GraphicsProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { HapticsProvider } from '@/components/providers/HapticsProvider';
import { Sidebar } from '@/components/common/Sidebar';
import { Footer } from '@/components/common/Footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "4kwalls - Premium 4K Wallpapers",
  description: "Discover and download high-quality 4K wallpapers.",
  icons: {
    icon: '/logo2.png',
    shortcut: '/logo2.png',
    apple: '/logo2.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <QueryProvider>
          <GraphicsProvider>
            <ThemeProvider>
              <HapticsProvider>
                <div className="min-h-screen flex flex-col">
                  <div className="flex-1">
                    {children}
                  </div>
                  <Footer />
                </div>
                <Sidebar />
                <Toaster richColors position="top-center" toastOptions={{ style: { zIndex: 99999 } }} />
                <SpeedInsights />
              </HapticsProvider>
            </ThemeProvider>
          </GraphicsProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
