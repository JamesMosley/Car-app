
"use client";

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

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
