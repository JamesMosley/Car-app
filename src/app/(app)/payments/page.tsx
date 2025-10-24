

"use client";

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { CreditCard, PlusCircle, Eye, Trash2, Search } from 'lucide-react';

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
  { id: 'PAY004', invoiceId: 'INV002', amount: 850.00, date: '2024-07-25', method: 'Cash' },
  { id: 'PAY005', invoiceId: 'INV008', amount: 5000.00, date: '2024-07-28', method: 'Credit Card' },
  { id: 'PAY006', invoiceId: 'INV012', amount: 220.00, date: '2024-08-12', method: 'Bank Transfer' },
  { id: 'PAY007', invoiceId: 'INV001', amount: 50.00, date: '2024-08-15', method: 'Other' }, // Example of 'Other'
];

const ITEMS_PER_PAGE = 5;

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentItemToView, setCurrentItemToView] = useState<Payment | null>(null);
  const [addFormState, setAddFormState] = useState<Omit<Payment, 'id'>>({ invoiceId: '', amount: '', date: '', method: '' });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);


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
    setPayments(prev => [newPayment, ...prev]);
    setAddFormState({ invoiceId: '', amount: '', date: '', method: '' }); // Reset form
    setCurrentPage(1); // Reset to first page
  };

  const openViewModal = (payment: Payment) => {
    setCurrentItemToView(payment);
    setIsViewModalOpen(true);
  };

  const handleVoidPayment = (paymentToVoid: Payment) => {
    if (window.confirm(`Are you sure you want to void payment ${paymentToVoid.id} for Invoice ${paymentToVoid.invoiceId}? This is usually irreversible.`)) {
      const updatedPayments = payments.filter(p => p.id !== paymentToVoid.id);
      setPayments(updatedPayments);
      
      const newFilteredPayments = updatedPayments.filter(payment =>
        [payment.id, payment.invoiceId, payment.amount.toString(), payment.date, payment.method].some(field =>
          field.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      const newTotalPages = Math.ceil(newFilteredPayments.length / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }
    }
  };

  const filteredPayments = useMemo(() => {
    return payments.filter(payment =>
      [payment.id, payment.invoiceId, payment.amount.toString(), payment.date, payment.method].some(field =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [payments, searchTerm]);

  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <CreditCard className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        </div>
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Record of all received payments. Search by ID, invoice ID, amount, date, or method.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); 
                }}
                className="pl-10"
              />
            </div>
          </div>
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
              {currentPayments.length > 0 ? (
                currentPayments.map((payment) => (
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No payments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
         {totalPages > 0 && (
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredPayments.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredPayments.length)} of {filteredPayments.length} payments.
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePrevPage} disabled={currentPage === 1} variant="outline" size="sm">
                Previous
              </Button>
              <Button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} variant="outline" size="sm">
                Next
              </Button>
            </div>
          </CardFooter>
        )}
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
