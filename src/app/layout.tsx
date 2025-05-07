import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Toaster } from "@/components/ui/toaster";
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});


export const metadata: Metadata = {
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
      <body className={`${geistSans.variable} antialiased flex flex-col min-h-screen`}>
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Left side: Can be used for a main logo or brand name if different from sidebar */}
            <div>
              {/* Example: <Link href="/" className="flex items-center space-x-2 font-bold">GarageHub</Link> */}
            </div>

            {/* Right side: User info and notifications */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  {/* <AvatarImage src="/path-to-user-image.png" alt="James Mosley" /> */}
                  <AvatarFallback>JM</AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:block">James Mosley</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              {children}
            </SidebarInset>
          </SidebarProvider>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
