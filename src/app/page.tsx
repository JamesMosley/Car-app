import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Truck, FileText, Archive, CreditCard, ArrowRight } from 'lucide-react';

const sections = [
  { href: '/vehicles', title: 'Vehicles', description: 'Manage your fleet vehicles.', icon: Truck },
  { href: '/invoices', title: 'Invoices', description: 'Track and manage invoices.', icon: FileText },
  { href: '/inventory', title: 'Inventory', description: 'Keep track of parts and stock.', icon: Archive },
  { href: '/payments', title: 'Payments', description: 'Monitor and record payments.', icon: CreditCard },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <LayoutDashboard className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <p className="text-muted-foreground">
        Welcome to FleetFlow! Get an overview of your fleet operations and quickly access different management sections.
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

        {/* Placeholder for future charts or summaries */}
       <Card className="mt-4">
          <CardHeader>
            <CardTitle>Fleet Overview</CardTitle>
            <CardDescription>Summary statistics and charts will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-center h-40 bg-secondary rounded-md">
                <p className="text-muted-foreground">Chart Placeholder</p>
             </div>
          </CardContent>
       </Card>

    </div>
  );
}
