
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, PlusCircle } from 'lucide-react';

export default function PaymentsPage() {
  // Placeholder data
  const payments = [
    { id: 'PAY001', invoiceId: 'INV001', amount: 1200.50, date: '2024-07-18', method: 'Credit Card' },
    { id: 'PAY002', invoiceId: 'INV004', amount: 500.00, date: '2024-07-21', method: 'Bank Transfer' },
    { id: 'PAY003', invoiceId: 'INV005', amount: 300.25, date: '2024-07-23', method: 'Check' },
  ];

  const handleViewDetails = (payment: typeof payments[0]) => {
    console.log('View payment details:', payment);
    // Placeholder: Open a modal or navigate to a detailed view page
  };

  const handleVoidPayment = (payment: typeof payments[0]) => {
    if (window.confirm(`Are you sure you want to void payment ${payment.id} for Invoice ${payment.invoiceId}?`)) {
      console.log('Void payment:', payment);
      // Placeholder: Call an API to void the payment and update state
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <CreditCard className="w-8 h-8 text-primary" />
             <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Record Payment
            </Button>
       </div>


      {/* Record Payment Form Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Record New Payment</CardTitle>
          <CardDescription>Enter the details of the received payment.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="invoiceId">Invoice ID</Label>
            <Input id="invoiceId" placeholder="e.g., INV001" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount Received</Label>
            <Input id="amount" type="number" placeholder="e.g., 1200.50" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="paymentDate">Payment Date</Label>
            <Input id="paymentDate" type="date" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
             <Select>
                <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto">Save Payment</Button>
        </CardFooter>
      </Card>

      {/* Payments List Table */}
       <Card>
         <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Record of all received payments.</CardDescription>
         </CardHeader>
         <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.invoiceId}</TableCell>
                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(payment)}>View Details</Button>
                         <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleVoidPayment(payment)}>Void</Button>
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
