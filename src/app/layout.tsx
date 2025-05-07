import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Toaster } from "@/components/ui/toaster";
import { Bell, Search } from 'lucide-react'; // Added Search icon
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input'; // Added Input component

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
            {/* Left side: GarageHub title and Search */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center space-x-2 text-lg font-bold text-primary">
                GarageHub
              </Link>
              <div className="relative ml-4 hidden md:block"> {/* Hide search on small screens initially, can be adjusted */}
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="h-9 w-full rounded-md pl-10 pr-4 md:w-[200px] lg:w-[300px]"
                />
              </div>
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
