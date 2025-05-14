
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Archive, PlusCircle, Edit, Trash2 } from 'lucide-react';

type InventoryItem = {
  id: string;
  name: string;
  quantity: number | string; // Allow string for input, convert to number on save
  location: string;
  sku?: string;
};

const initialInventoryItems: InventoryItem[] = [
  { id: 'P001', name: 'Oil Filter', quantity: 50, location: 'Shelf A1', sku: 'OF-1023' },
  { id: 'P002', name: 'Brake Pads (Set)', quantity: 25, location: 'Bin B3', sku: 'BP-4050' },
  { id: 'P003', name: 'Headlight Bulb', quantity: 100, location: 'Shelf A2', sku: 'HB-H4' },
];

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItemToEdit, setCurrentItemToEdit] = useState<InventoryItem | null>(null);
  const [editFormState, setEditFormState] = useState<Omit<InventoryItem, 'id'>>({ name: '', quantity: '', location: '', sku: '' });
  const [addItemFormState, setAddItemFormState] = useState<Omit<InventoryItem, 'id'>>({ name: '', quantity: '', location: '', sku: '' });

  const handleAddItemInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAddItemFormState(prev => ({ ...prev, [id]: id === 'quantity' ? (value === '' ? '' : Number(value)) : value }));
  };

  const handleAddNewItem = () => {
    if (!addItemFormState.name || addItemFormState.quantity === '' || !addItemFormState.location) {
      alert('Please fill in Name, Quantity, and Location.');
      return;
    }
    const newItem: InventoryItem = {
      id: `P${Date.now()}`,
      name: addItemFormState.name,
      quantity: Number(addItemFormState.quantity),
      location: addItemFormState.location,
      sku: addItemFormState.sku || '',
    };
    setInventoryItems(prev => [...prev, newItem]);
    setAddItemFormState({ name: '', quantity: '', location: '', sku: '' }); // Reset form
  };

  const openEditModal = (item: InventoryItem) => {
    setCurrentItemToEdit(item);
    setEditFormState({ name: item.name, quantity: item.quantity, location: item.location, sku: item.sku || '' });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditFormState(prev => ({ ...prev, [id]: id === 'quantity' ? (value === '' ? '' : Number(value)) : value }));
  };

  const handleSaveEdit = () => {
    if (!currentItemToEdit || !editFormState.name || editFormState.quantity === '' || !editFormState.location) {
      alert('Please fill in Name, Quantity, and Location.');
      return;
    }
    setInventoryItems(prevItems =>
      prevItems.map(item =>
        item.id === currentItemToEdit.id ? { ...item, ...editFormState, quantity: Number(editFormState.quantity) } : item
      )
    );
    setIsEditModalOpen(false);
    setCurrentItemToEdit(null);
  };

  const handleDelete = (itemToDelete: InventoryItem) => {
    if (window.confirm(`Are you sure you want to delete ${itemToDelete.name} (ID: ${itemToDelete.id})?`)) {
      setInventoryItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
      console.log('Deleted item - ID:', itemToDelete.id, 'Name:', itemToDelete.name);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Archive className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        </div>
        {/* The "Add Item" button functionality is now part of the form card below */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Inventory Item</CardTitle>
          <CardDescription>Enter details for the new stock item.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Item Name</Label>
            <Input id="name" placeholder="e.g., Oil Filter" value={addItemFormState.name} onChange={handleAddItemInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" type="number" placeholder="e.g., 50" value={addItemFormState.quantity} onChange={handleAddItemInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g., Shelf A1" value={addItemFormState.location} onChange={handleAddItemInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sku">SKU / Part Number</Label>
            <Input id="sku" placeholder="Optional SKU or Part #" value={addItemFormState.sku} onChange={handleAddItemInputChange} />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={handleAddNewItem}>
            <PlusCircle className="mr-2 h-4 w-4" /> Save Item
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>Current stock levels and locations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(item)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Item Modal */}
      {currentItemToEdit && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Inventory Item: {currentItemToEdit.name}</DialogTitle>
              <DialogDescription>Make changes to the item details below.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={editFormState.name} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">Quantity</Label>
                <Input id="quantity" type="number" value={editFormState.quantity} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input id="location" value={editFormState.location} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sku" className="text-right">SKU</Label>
                <Input id="sku" value={editFormState.sku} onChange={handleEditInputChange} className="col-span-3" />
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
