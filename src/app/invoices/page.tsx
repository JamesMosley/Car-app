
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { FileText, PlusCircle, Eye, Edit, Trash2 } from 'lucide-react';

type Invoice = {
  id: string;
  client: string;
  amount: number | string;
  date: string;
  dueDate: string;
  description: string;
  status: 'Paid' | 'Pending' | 'Overdue' | string; // Allow string for more flexibility if needed
};

const initialInvoices: Invoice[] = [
  { id: 'INV001', client: 'Acme Corp', amount: 1200.50, date: '2024-07-15', dueDate: '2024-08-15', description: 'Web Development Services', status: 'Paid' },
  { id: 'INV002', client: 'Globex Inc', amount: 850.00, date: '2024-07-20', dueDate: '2024-08-20', description: 'Consulting Hours', status: 'Pending' },
  { id: 'INV003', client: 'Stark Industries', amount: 2500.75, date: '2024-07-22', dueDate: '2024-08-01', description: 'Hardware Supplies', status: 'Overdue' },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItemToView, setCurrentItemToView] = useState<Invoice | null>(null);
  const [currentItemToEdit, setCurrentItemToEdit] = useState<Invoice | null>(null);
  const [editFormState, setEditFormState] = useState<Omit<Invoice, 'id'>>({ client: '', amount: '', date: '', dueDate: '', description: '', status: 'Pending' });
  const [addFormState, setAddFormState] = useState<Omit<Invoice, 'id'>>({ client: '', amount: '', date: '', dueDate: '', description: '', status: 'Pending' });

  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setAddFormState(prev => ({ ...prev, [id]: id === 'amount' ? (value === '' ? '' : Number(value)) : value }));
  };

  const handleCreateInvoice = () => {
    if (!addFormState.client || addFormState.amount === '' || !addFormState.date || !addFormState.dueDate) {
      alert('Please fill in Client, Amount, Invoice Date, and Due Date.');
      return;
    }
    const newInvoice: Invoice = {
      id: `INV${Date.now()}`,
      ...addFormState,
      amount: Number(addFormState.amount),
    };
    setInvoices(prev => [...prev, newInvoice]);
    setAddFormState({ client: '', amount: '', date: '', dueDate: '', description: '', status: 'Pending' }); // Reset form
  };
  
  const openViewModal = (invoice: Invoice) => {
    setCurrentItemToView(invoice);
    setIsViewModalOpen(true);
  };

  const openEditModal = (invoice: Invoice) => {
    setCurrentItemToEdit(invoice);
    setEditFormState({ client: invoice.client, amount: invoice.amount, date: invoice.date, dueDate: invoice.dueDate, description: invoice.description, status: invoice.status });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEditFormState(prev => ({ ...prev, [id]: id === 'amount' ? (value === '' ? '' : Number(value)) : value }));
  };

  const handleSaveEdit = () => {
    if (!currentItemToEdit || !editFormState.client || editFormState.amount === '' || !editFormState.date || !editFormState.dueDate) {
      alert('Please fill in Client, Amount, Invoice Date, and Due Date.');
      return;
    }
    setInvoices(prevInvoices =>
      prevInvoices.map(inv =>
        inv.id === currentItemToEdit.id ? { ...inv, ...editFormState, amount: Number(editFormState.amount) } : inv
      )
    );
    setIsEditModalOpen(false);
    setCurrentItemToEdit(null);
  };

  const handleDelete = (invoiceToDelete: Invoice) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoiceToDelete.id} for ${invoiceToDelete.client}?`)) {
      setInvoices(prevInvoices => prevInvoices.filter(inv => inv.id !== invoiceToDelete.id));
      console.log('Deleted invoice - ID:', invoiceToDelete.id, 'Client:', invoiceToDelete.client);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        </div>
        {/* The "Create Invoice" button functionality is now part of the form card below */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Invoice</CardTitle>
          <CardDescription>Fill in the details to generate a new invoice.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="client">Client Name</Label>
            <Input id="client" placeholder="e.g., Acme Corp" value={addFormState.client} onChange={handleAddInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" placeholder="e.g., 1200.50" value={addFormState.amount} onChange={handleAddInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Invoice Date</Label>
            <Input id="date" type="date" value={addFormState.date} onChange={handleAddInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" value={addFormState.dueDate} onChange={handleAddInputChange} />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Brief description of services or items" value={addFormState.description} onChange={handleAddInputChange} />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <select id="status" value={addFormState.status} onChange={(e) => setAddFormState(prev => ({...prev, status: e.target.value}))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
            </select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={handleCreateInvoice}>
            <PlusCircle className="mr-2 h-4 w-4" /> Save Invoice
          </Button>
        </CardFooter>
      </Card>

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
                  <TableCell>${Number(invoice.amount).toFixed(2)}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openViewModal(invoice)}>
                      <Eye className="mr-2 h-4 w-4" /> View
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(invoice)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(invoice)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Invoice Modal */}
      {currentItemToView && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>View Invoice: {currentItemToView.id}</DialogTitle>
              <DialogDescription>Details for invoice sent to {currentItemToView.client}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-4 text-sm">
              <p><strong>Client:</strong> {currentItemToView.client}</p>
              <p><strong>Amount:</strong> ${Number(currentItemToView.amount).toFixed(2)}</p>
              <p><strong>Date:</strong> {currentItemToView.date}</p>
              <p><strong>Due Date:</strong> {currentItemToView.dueDate}</p>
              <p><strong>Status:</strong> {currentItemToView.status}</p>
              <p><strong>Description:</strong> {currentItemToView.description}</p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Invoice Modal */}
      {currentItemToEdit && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Invoice: {currentItemToEdit.id}</DialogTitle>
              <DialogDescription>Modify the invoice details below.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client" className="text-right">Client</Label>
                <Input id="client" value={editFormState.client} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Amount</Label>
                <Input id="amount" type="number" value={editFormState.amount} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input id="date" type="date" value={editFormState.date} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">Due Date</Label>
                <Input id="dueDate" type="date" value={editFormState.dueDate} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" value={editFormState.description} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                 <select id="status" value={editFormState.status} onChange={(e) => setEditFormState(prev => ({...prev, status: e.target.value}))} className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
