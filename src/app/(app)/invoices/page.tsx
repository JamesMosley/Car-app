

"use client";

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { FileText, PlusCircle, Eye, Edit, Trash2, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


type Invoice = {
  id: string;
  client: string;
  amount: number | string;
  date: string;
  dueDate: string;
  description: string;
  status: 'Paid' | 'Pending' | 'Overdue' | string; 
};

const initialInvoices: Invoice[] = [
  { id: 'INV001', client: 'Acme Corp', amount: 1200.50, date: '2024-07-15', dueDate: '2024-08-15', description: 'Web Development Services', status: 'Paid' },
  { id: 'INV002', client: 'Globex Inc', amount: 850.00, date: '2024-07-20', dueDate: '2024-08-20', description: 'Consulting Hours', status: 'Pending' },
  { id: 'INV003', client: 'Stark Industries', amount: 2500.75, date: '2024-07-22', dueDate: '2024-08-01', description: 'Hardware Supplies', status: 'Overdue' },
  { id: 'INV004', client: 'Wayne Enterprises', amount: 1500.00, date: '2024-06-10', dueDate: '2024-07-10', description: 'Security System Upgrade', status: 'Paid' },
  { id: 'INV005', client: 'Cyberdyne Systems', amount: 3200.00, date: '2024-06-25', dueDate: '2024-07-25', description: 'AI Model Training', status: 'Pending' },
  { id: 'INV006', client: 'Ollivanders Wand Shop', amount: 75.50, date: '2024-05-30', dueDate: '2024-06-15', description: 'Unicorn Hair Restock', status: 'Overdue' },
  { id: 'INV007', client: 'Soylent Corp', amount: 999.99, date: '2024-07-01', dueDate: '2024-07-31', description: 'Food Product Delivery', status: 'Pending' },
  { id: 'INV008', client: 'Pied Piper', amount: 5000.00, date: '2024-07-10', dueDate: '2024-08-10', description: 'Compression Algorithm License', status: 'Paid' },
  { id: 'INV009', client: 'Stark Industries', amount: 1800.00, date: '2024-08-01', dueDate: '2024-09-01', description: 'Arc Reactor Maintenance', status: 'Pending' },
  { id: 'INV010', client: 'Gekko & Co', amount: 10000.00, date: '2024-06-01', dueDate: '2024-07-01', description: 'Financial Consulting', status: 'Overdue' },
  { id: 'INV011', client: 'Acme Corp', amount: 750.25, date: '2024-08-05', dueDate: '2024-09-05', description: 'Cloud Hosting Services', status: 'Pending' },
  { id: 'INV012', client: 'Globex Inc', amount: 220.00, date: '2024-08-10', dueDate: '2024-09-10', description: 'Gadget Prototypes', status: 'Paid' },
];

const ITEMS_PER_PAGE = 5;

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItemToView, setCurrentItemToView] = useState<Invoice | null>(null);
  const [currentItemToEdit, setCurrentItemToEdit] = useState<Invoice | null>(null);
  const [editFormState, setEditFormState] = useState<Omit<Invoice, 'id'>>({ client: '', amount: '', date: '', dueDate: '', description: '', status: 'Pending' });
  const [addFormState, setAddFormState] = useState<Omit<Invoice, 'id'>>({ client: '', amount: '', date: '', dueDate: '', description: '', status: 'Pending' });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setAddFormState(prev => ({ ...prev, [id]: id === 'amount' ? (value === '' ? '' : Number(value)) : value }));
  };
  
  const handleAddSelectChange = (value: string) => {
    setAddFormState(prev => ({ ...prev, status: value }));
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
    setInvoices(prev => [newInvoice, ...prev]);
    setAddFormState({ client: '', amount: '', date: '', dueDate: '', description: '', status: 'Pending' }); // Reset form
    setCurrentPage(1); // Reset to first page to see new item
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
    const { name, value } = e.target;
    setEditFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSelectChange = (value: string) => {
    setEditFormState(prev => ({ ...prev, status: value }));
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
      const updatedInvoices = invoices.filter(inv => inv.id !== invoiceToDelete.id);
      setInvoices(updatedInvoices);
      
      const newFilteredInvoices = updatedInvoices.filter(invoice =>
        [invoice.id, invoice.client, invoice.amount.toString(), invoice.date, invoice.dueDate, invoice.status, invoice.description].some(field =>
          field.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      const newTotalPages = Math.ceil(newFilteredInvoices.length / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice =>
      [invoice.id, invoice.client, invoice.amount.toString(), invoice.date, invoice.dueDate, invoice.status, invoice.description].some(field =>
        typeof field === 'string' && field.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [invoices, searchTerm]);

  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);

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
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        </div>
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
            <Label htmlFor="status_add">Status</Label>
            <Select value={addFormState.status} onValueChange={handleAddSelectChange}>
                <SelectTrigger id="status_add">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
            </Select>
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Invoice List</CardTitle>
              <CardDescription>Overview of all invoices. Search by ID, client, amount, dates, status, or description.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
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
                <TableHead>Invoice ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentInvoices.length > 0 ? (
                currentInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>${Number(invoice.amount).toFixed(2)}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No invoices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {totalPages > 0 && (
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredInvoices.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredInvoices.length)} of {filteredInvoices.length} invoices.
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
                <Input id="client" name="client" value={editFormState.client} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Amount</Label>
                <Input id="amount" name="amount" type="number" value={editFormState.amount} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input id="date" name="date" type="date" value={editFormState.date} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">Due Date</Label>
                <Input id="dueDate" name="dueDate" type="date" value={editFormState.dueDate} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" name="description" value={editFormState.description} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                 <Select value={editFormState.status} onValueChange={handleEditSelectChange}>
                    <SelectTrigger id="status" className="col-span-3">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                    </SelectContent>
                </Select>
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
