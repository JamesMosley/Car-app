import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { FileText, PlusCircle } from 'lucide-react';

export default function InvoicesPage() {
  // Placeholder data
  const invoices = [
    { id: 'INV001', client: 'Acme Corp', amount: 1200.50, date: '2024-07-15', status: 'Paid' },
    { id: 'INV002', client: 'Globex Inc', amount: 850.00, date: '2024-07-20', status: 'Pending' },
    { id: 'INV003', client: 'Stark Industries', amount: 2500.75, date: '2024-07-22', status: 'Overdue' },
  ];

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
       <div className="flex items-center justify-between gap-4">
           <div className="flex items-center gap-4">
               <FileText className="w-8 h-8 text-primary" />
               <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
           </div>
           <Button>
               <PlusCircle className="mr-2 h-4 w-4" /> Create Invoice
           </Button>
       </div>


      {/* Create Invoice Form Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Invoice</CardTitle>
          <CardDescription>Fill in the details to generate a new invoice.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="client">Client Name</Label>
            <Input id="client" placeholder="e.g., Acme Corp" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" placeholder="e.g., 1200.50" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="invoiceDate">Invoice Date</Label>
            <Input id="invoiceDate" type="date" />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Brief description of services or items" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto">Save Invoice</Button>
        </CardFooter>
      </Card>

      {/* Invoice List Table */}
       <Card>
         <CardHeader>
            <CardTitle>Invoice List</CardTitle>
            <CardDescription>Overview of all invoices.</CardDescription>
         </CardHeader>
         <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                     <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
         </CardContent>
      </Card>
    </div>
  );
}
