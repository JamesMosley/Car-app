
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { CreditCard, PlusCircle, Eye, Trash2 } from 'lucide-react'; // Removed Edit for payments as they are usually not edited post-creation.

type Payment = {
  id: string;
  invoiceId: string;
  amount: number | string;
  date: string;
  method: 'Credit Card' | 'Bank Transfer' | 'Check' | 'Cash' | 'Other' | string;
};

const initialPayments: Payment[] = [
  { id: 'PAY001', invoiceId: 'INV001', amount: 1200.50, date: '2024-07-18', method: 'Credit Card' },
  { id: 'PAY002', invoiceId: 'INV004', amount: 500.00, date: '2024-07-21', method: 'Bank Transfer' },
  { id: 'PAY003', invoiceId: 'INV005', amount: 300.25, date: '2024-07-23', method: 'Check' },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentItemToView, setCurrentItemToView] = useState<Payment | null>(null);
  const [addFormState, setAddFormState] = useState<Omit<Payment, 'id'>>({ invoiceId: '', amount: '', date: '', method: '' });

  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAddFormState(prev => ({ ...prev, [id]: id === 'amount' ? (value === '' ? '' : Number(value)) : value }));
  };

  const handleAddSelectChange = (value: string) => {
    setAddFormState(prev => ({ ...prev, method: value }));
  };

  const handleRecordPayment = () => {
    if (!addFormState.invoiceId || addFormState.amount === '' || !addFormState.date || !addFormState.method) {
      alert('Please fill in all fields.');
      return;
    }
    const newPayment: Payment = {
      id: `PAY${Date.now()}`,
      ...addFormState,
      amount: Number(addFormState.amount),
    };
    setPayments(prev => [...prev, newPayment]);
    setAddFormState({ invoiceId: '', amount: '', date: '', method: '' }); // Reset form
  };

  const openViewModal = (payment: Payment) => {
    setCurrentItemToView(payment);
    setIsViewModalOpen(true);
  };

  const handleVoidPayment = (paymentToVoid: Payment) => {
    if (window.confirm(`Are you sure you want to void payment ${paymentToVoid.id} for Invoice ${paymentToVoid.invoiceId}? This is usually irreversible.`)) {
      setPayments(prevPayments => prevPayments.filter(p => p.id !== paymentToVoid.id));
      console.log('Voided payment - ID:', paymentToVoid.id, 'Invoice ID:', paymentToVoid.invoiceId);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <CreditCard className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        </div>
        {/* The "Record Payment" button functionality is now part of the form card below */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Record New Payment</CardTitle>
          <CardDescription>Enter the details of the received payment.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="invoiceId">Invoice ID</Label>
            <Input id="invoiceId" placeholder="e.g., INV001" value={addFormState.invoiceId} onChange={handleAddInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount Received</Label>
            <Input id="amount" type="number" placeholder="e.g., 1200.50" value={addFormState.amount} onChange={handleAddInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Payment Date</Label>
            <Input id="date" type="date" value={addFormState.date} onChange={handleAddInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select value={addFormState.method} onValueChange={handleAddSelectChange}>
              <SelectTrigger id="method">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Check">Check</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={handleRecordPayment}>
            <PlusCircle className="mr-2 h-4 w-4" /> Save Payment
          </Button>
        </CardFooter>
      </Card>

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
                  <TableCell>${Number(payment.amount).toFixed(2)}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openViewModal(payment)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleVoidPayment(payment)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Void
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Payment Modal */}
      {currentItemToView && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>View Payment: {currentItemToView.id}</DialogTitle>
              <DialogDescription>Details for payment towards invoice {currentItemToView.invoiceId}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-4 text-sm">
              <p><strong>Invoice ID:</strong> {currentItemToView.invoiceId}</p>
              <p><strong>Amount:</strong> ${Number(currentItemToView.amount).toFixed(2)}</p>
              <p><strong>Date:</strong> {currentItemToView.date}</p>
              <p><strong>Method:</strong> {currentItemToView.method}</p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
