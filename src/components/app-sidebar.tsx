
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  House, // Changed from LayoutDashboard
  Truck,
  FileText,
  Archive,
  CreditCard,
  Wrench, 
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: House }, // Changed icon
  { href: '/vehicles', label: 'Vehicles', icon: Truck },
  { href: '/invoices', label: 'Invoices', icon: FileText },
  { href: '/inventory', label: 'Inventory', icon: Archive },
  { href: '/payments', label: 'Payments', icon: CreditCard },
];

export function AppSidebar() {
  const pathname = usePathname();

 