
"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { House, Truck, FileText, Archive, CreditCard, ArrowRight } from 'lucide-react';
import { Bar, BarChart, Rectangle, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";

const sections = [
  { href: '/vehicles', title: 'Vehicles', description: 'Manage your fleet vehicles.', icon: Truck },
  { href: '/invoices', title: 'Invoices', description: 'Track and manage invoices.', icon: FileText },
  { href: '/inventory', title: 'Inventory', description: 'Keep track of parts and stock.', icon: Archive },
  { href: '/payments', title: 'Payments', description: 'Monitor and record payments.', icon: CreditCard },
];

const monthlyRevenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
  { month: 'Jul', revenue: 7000 },
];

const chartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const vehicleStatusData = {
  completed: 10,
  inProgress: 5,
  pending: 3,
  total: 18,
};

export default function DashboardPage() {
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
        {sections.map((section) => (
          <Card key={section.title} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{section.title}</CardTitle>
              <section.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground pb-4">{section.description}</p>
               <Link href={section.href} passHref>
                 <Button variant="outline" size="sm" className="w-full">
                   Go to {section.title}
                   <ArrowRight className="ml-2 h-4 w-4" />
                 </Button>
               </Link>
            </CardContent>
          </Card>
        ))}
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
                      <BarChart accessibilityLayer data={monthlyRevenueData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
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
                </Header>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex h-4 w-full rounded-md overflow-hidden">
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
                         <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-500"></span><span>Completed</span></div>
                        <span className="font-medium">{vehicleStatusData.completed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-blue-500"></span><span>In Progress</span></div>
                         <span className="font-medium">{vehicleStatusData.inProgress}</span>
                    </div>
                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-orange-500"></span><span>Pending</span></div>
                         <span className="font-medium">{vehicleStatusData.pending}</span>
                    </div>
                </CardContent>
            </Card>
       </div>
       <Card className="mt-4">
          <CardHeader>
            <CardTitle>Garage Overview</CardTitle>
            <CardDescription>Additional summary statistics will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-center h-40 bg-secondary rounded-md">
                <p className="text-muted-foreground">Placeholder</p>
             </div>
          </CardContent>
       </Card>

    </div>
  );
}
