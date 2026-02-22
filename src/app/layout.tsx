
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ChatBot from '@/components/ChatBot';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
          <AuthProvider>
              {children}
          </AuthProvider>
        </GoogleOAuthProvider>
        <ChatBot />
        <Toaster />
      </body>
    </html>
  );
}
