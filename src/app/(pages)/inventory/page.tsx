
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Archive, PlusCircle, Edit, Trash2, Search } from 'lucide-react';

type InventoryItem = {
  id: string;
  name: string;
  quantity: number | string;
  location: string;
  sku?: string;
};

const getUserStorageKey = (prefix: string) => {
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
  return userEmail ? `${prefix}_${userEmail}` : null;
};

const loadUserData = <T,>(key: string, defaultData: T[]): T[] => {
  if (typeof window === 'undefined') return defaultData;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultData;
    }
  }
  return defaultData;
};

const saveUserData = <T,>(key: string, data: T[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

const initialInventoryItems: InventoryItem[] = [];

const ITEMS_PER_PAGE = 5;

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storageKey = getUserStorageKey('inventory');
    if (storageKey) {
      setInventoryItems(loadUserData(storageKey, []));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const storageKey = getUserStorageKey('inventory');
      if (storageKey) {
        saveUserData(storageKey, inventoryItems);
      }
    }
  }, [inventoryItems, isLoaded]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItemToEdit, setCurrentItemToEdit] = useState<InventoryItem | null>(null);
  const [editFormState, setEditFormState] = useState<Omit<InventoryItem, 'id'>>({ name: '', quantity: '', location: '', sku: '' });
  const [addItemFormState, setAddItemFormState] = useState<Omit<InventoryItem, 'id'>>({ name: '', quantity: '', location: '', sku: '' });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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
    setInventoryItems(prev => [newItem, ...prev]);
    setAddItemFormState({ name: '', quantity: '', location: '', sku: '' }); // Reset form
    setCurrentPage(1); // Reset to first page to see new item
  };

  const openEditModal = (item: InventoryItem) => {
    setCurrentItemToEdit(item);
    setEditFormState({ name: item.name, quantity: item.quantity, location: item.location, sku: item.sku || '' });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const inputName = e.target.name;
    setEditFormState(prev => ({ ...prev, [inputName]: value }));
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
      const updatedItems = inventoryItems.filter(item => item.id !== itemToDelete.id);
      setInventoryItems(updatedItems);
      
      // Recalculate total pages and adjust current page if necessary
      const newFilteredItems = updatedItems.filter(item =>
        [item.id, item.name, item.location, item.sku || '', item.quantity.toString()].some(field =>
          field.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      const newTotalPages = Math.ceil(newFilteredItems.length / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }
    }
  };

  const filteredInventoryItems = useMemo(() => {
    return inventoryItems.filter(item =>
      [item.id, item.name, item.location, item.sku || '', item.quantity.toString()].some(field =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [inventoryItems, searchTerm]);

  const totalPages = Math.ceil(filteredInventoryItems.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentInventoryItems = filteredInventoryItems.slice(indexOfFirstItem, indexOfLastItem);

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
          <Archive className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        </div>
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
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Inventory List</CardTitle>
              <CardDescription>Current stock levels and locations. Search by ID, name, location, SKU, or quantity.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
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
                <TableHead>Item ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentInventoryItems.length > 0 ? (
                currentInventoryItems.map((item) => (
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No inventory items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {totalPages > 0 && (
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredInventoryItems.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredInventoryItems.length)} of {filteredInventoryItems.length} items.
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
                <Input id="name" name="name" value={editFormState.name} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" value={editFormState.quantity} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input id="location" name="location" value={editFormState.location} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sku" className="text-right">SKU</Label>
                <Input id="sku" name="sku" value={editFormState.sku} onChange={handleEditInputChange} className="col-span-3" />
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
