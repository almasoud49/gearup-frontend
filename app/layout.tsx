import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GearUp - Rent Sports & Outdoor Gear',
  description: 'Rent sports and outdoor equipment instantly',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('gearup-theme');var dark=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);var el=document.documentElement;if(dark)el.classList.add('dark');else el.classList.remove('dark')}catch(e){}})();`,
          }}
        />
      </head>
      <body id="top" className={`flex min-h-screen flex-col bg-background text-foreground ${inter.className}`} suppressHydrationWarning>
        <Providers>
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}