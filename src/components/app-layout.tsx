
"use client";

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import AppPages from '@/app/(pages)/layout';
import LoginPage from '@/app/login/page';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isAuthenticated && !isLoginPage) {
    return <AppPages>{children}</AppPages>
  }

  if (!isAuthenticated && !isLoginPage) {
    return <LoginPage />
  }

  return <>{children}</>
}
