
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

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
         <Wrench className="w-6 h-6 text-primary" /> 
          <h1 className="text-lg font-semibold text-primary">GarageHub</h1> 
          <div className="ml-auto md:hidden">
             <SidebarTrigger/>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
       <SidebarFooter className="hidden md:flex">
         <SidebarTrigger/>
       </SidebarFooter>
    </Sidebar>
  );
}
