
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { House, Truck, FileText, Archive, CreditCard, ArrowRight } from 'lucide-react';
import { Bar, BarChart, Rectangle, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number | string;
  vin: string;
  status: string;
};

type Invoice = {
  id: string;
  client: string;
  amount: number | string;
  date: string;
  dueDate: string;
  description: string;
  status: string;
};

type InventoryItem = {
  id: string;
  name: string;
  quantity: number | string;
  location: string;
  sku?: string;
};

const sections = [
  { href: '/vehicles', title: 'Vehicles', description: 'Manage your fleet vehicles.', icon: Truck },
  { href: '/invoices', title: 'Invoices', description: 'Track and manage invoices.', icon: FileText },
  { href: '/inventory', title: 'Inventory', description: 'Keep track of parts and stock.', icon: Archive },
  { href: '/payments', title: 'Payments', description: 'Monitor and record payments.', icon: CreditCard },
];

const loadUserData = <T,>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

const chartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  const [vehicleCount, setVehicleCount] = useState(0);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [inventoryCount, setInventoryCount] = useState(0);
  const [vehicleStatusData, setVehicleStatusData] = useState({ completed: 0, inProgress: 0, pending: 0, total: 0 });
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<{ month: string; revenue: number }[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      setIsLoaded(true);
      return;
    }

    const vehicles = loadUserData<Vehicle>(`vehicles_${userEmail}`);
    const invoices = loadUserData<Invoice>(`invoices_${userEmail}`);
    const inventory = loadUserData<InventoryItem>(`inventory_${userEmail}`);

    setVehicleCount(vehicles.length);
    setInvoiceCount(invoices.length);
    setInventoryCount(inventory.length);

    const active = vehicles.filter(v => v.status === 'Active').length;
    const maintenance = vehicles.filter(v => v.status === 'Maintenance').length;
    const inactive = vehicles.filter(v => v.status === 'Inactive').length;
    setVehicleStatusData({
      completed: active,
      inProgress: maintenance,
      pending: inactive,
      total: vehicles.length,
    });

    const paidInvoices = invoices.filter(i => i.status === 'Paid');
    const revenueByMonth: Record<string, number> = {};
    paidInvoices.forEach(inv => {
      const amount = typeof inv.amount === 'number' ? inv.amount : parseFloat(String(inv.amount)) || 0;
      const month = inv.date.slice(0, 7);
      revenueByMonth[month] = (revenueByMonth[month] || 0) + amount;
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear().toString();
    const revenueData = months.map(month => ({
      month,
      revenue: revenueByMonth[`${currentYear}-${(months.indexOf(month) + 1).toString().padStart(2, '0')}`] || 0,
    }));
    setMonthlyRevenueData(revenueData);

    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <House className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <p className="text-muted-foreground">
        Welcome to GarageHub! Get an overview of your garage operations and quickly access different management sections.
      </p>

<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => {
          let count = 0;
          if (section.href === '/vehicles') count = vehicleCount;
          else if (section.href === '/invoices') count = invoiceCount;
          else if (section.href === '/inventory') count = inventoryCount;

          return (
            <Card key={section.title} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{section.title}</CardTitle>
                <section.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground pb-4">{section.description}</p>
                 <Link href={section.href} passHref>
                    <Button variant="outline" size="sm" className="w-full">
                      Go to {section.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

       <div className="grid gap-4 md:grid-cols-2">
           <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Overview of revenue generated per month.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                  <ResponsiveContainer width="100%" height={200}>
                      <BarChart accessibilityLayer data={monthlyRevenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" />
                          <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                          />
                          <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                           <ChartTooltip
                             cursor={false}
                             content={<ChartTooltipContent hideLabel />}
                           />
                          <Bar
                             dataKey="revenue"
                             fill="var(--color-revenue)"
                             radius={4}
                             activeBar={<Rectangle fillOpacity={0.8} />}
                          />
                      </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
           </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Vehicle Status</CardTitle>
                    <CardDescription>Current status distribution of vehicles.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <div className="flex h-5 w-mid rounded-full overflow-hidden ">
                        <div
                            className="bg-green-500"
                            style={{ width: `${(vehicleStatusData.completed / vehicleStatusData.total) * 100}%` }}
                        ></div>
                        <div
                            className="bg-blue-500"
                            style={{ width: `${(vehicleStatusData.inProgress / vehicleStatusData.total) * 100}%` }}
                        ></div>
                        <div
                            className="bg-orange-500"
                            style={{ width: `${(vehicleStatusData.pending / vehicleStatusData.total) * 100}%` }}
                        ></div>
                    </div>

                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-green-500"></span><span>Completed</span></div>
                        <span className="font-medium">{vehicleStatusData.completed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-blue-500"></span><span>In Progress</span></div>
                         <span className="font-medium">{vehicleStatusData.inProgress}</span>
                    </div>
                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-orange-500"></span><span>Pending</span></div>
                         <span className="font-medium">{vehicleStatusData.pending}</span>
                    </div>
                </CardContent>
            </Card>
       </div>
<Card className="mt-4">
           <CardHeader>
             <CardTitle>Quick Stats</CardTitle>
             <CardDescription>Summary of your garage data.</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="grid grid-cols-3 gap-4 text-center">
               <div className="p-4 bg-secondary rounded-lg">
                 <div className="text-2xl font-bold">{vehicleCount}</div>
                 <div className="text-sm text-muted-foreground">Total Vehicles</div>
               </div>
               <div className="p-4 bg-secondary rounded-lg">
                 <div className="text-2xl font-bold">{invoiceCount}</div>
                 <div className="text-sm text-muted-foreground">Total Invoices</div>
               </div>
               <div className="p-4 bg-secondary rounded-lg">
                 <div className="text-2xl font-bold">{inventoryCount}</div>
                 <div className="text-sm text-muted-foreground">Inventory Items</div>
               </div>
             </div>
           </CardContent>
        </Card>
    </div>
  );
}
