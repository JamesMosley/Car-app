
"use client" // Required for recharts client components

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { House, Truck, FileText, Archive, CreditCard, ArrowRight } from 'lucide-react'; // Changed LayoutDashboard to House
import { Bar, BarChart, Rectangle, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";

const sections = [
  { href: '/vehicles', title: 'Vehicles', description: 'Manage your fleet vehicles.', icon: Truck },
  { href: '/invoices', title: 'Invoices', description: 'Track and manage invoices.', icon: FileText },
  { href: '/inventory', title: 'Inventory', description: 'Keep track of parts and stock.', icon: Archive },
  { href: '/payments', title: 'Payments', description: 'Monitor and record payments.', icon: CreditCard },
];

// Placeholder data for Monthly Revenue
const monthlyRevenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
  { month: 'Jul', revenue: 7000 },
  { month: 'Aug', revenue: 6500 },
  { month: 'Sep', revenue: 7800 },
  { month: 'Oct', revenue: 8000 },
  { month: 'Nov', revenue: 9000 },
  { month: 'Dec', revenue: 9300 },
  // Add more months as needed
];

const chartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))", // This will now pick up the blue primary color
  },
} satisfies ChartConfig;

// Placeholder data for Vehicle Status
const vehicleStatusData = {
  completed: 10,
  inProgress: 5,
  pending: 3,
  total: 15 + 5 + 3, // Calculate total for percentages
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <House className="w-8 h-8 text-primary" /> {/* Changed icon */}
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

        {/* New Sections: Monthly Revenue and Vehicle Status */}
       <div className="grid gap-4 md:grid-cols-2">
           {/* Monthly Revenue Chart */}
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

           {/* Vehicle Status Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Vehicle Status</CardTitle>
                    <CardDescription>Current status distribution of vehicles.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    {/* Segmented Status Bar */}
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

                    {/* Status Labels and Counts */}
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
        {/* Placeholder for other summaries */}
       <Card className="mt-4">
          <CardHeader>
            <CardTitle>Garage Overview</CardTitle> {/* Changed from Fleet Overview */}
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
