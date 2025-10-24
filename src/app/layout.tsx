
"use client";

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Wrench } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

// This can't be in the component body because of "use client"
const metadata: Metadata = {
  title: 'GarageHub',
  description: 'Manage your garage with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      if (!isAuthenticated && pathname !== '/login') {
        router.replace('/login');
      }
    }
  }, [isClient, pathname, router]);

  if (!isClient) {
    return (
      <html lang="en">
        <body className={`${inter.className} flex items-center justify-center min-h-screen bg-background`}>
           <div className="flex items-center gap-2">
             <Wrench className="w-8 h-8 text-primary animate-spin" />
             <h1 className="text-2xl font-bold text-primary">Loading GarageHub...</h1>
           </div>
        </body>
      </html>
    );
  }

  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated && pathname !== '/login') {
     return (
      <html lang="en">
        <body className={`${inter.className} flex items-center justify-center min-h-screen bg-background`}>
           <div className="flex items-center gap-2">
             <Wrench className="w-8 h-8 text-primary animate-spin" />
             <h1 className="text-2xl font-bold text-primary">Redirecting to login...</h1>
           </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <title>{String(metadata.title)}</title>
        <meta name="description" content={String(metadata.description)} />
      </head>
      <body className={inter.className}>
          {children}
          <Toaster />
      </body>
    </html>
  );
}
