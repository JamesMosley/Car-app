
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Archive, PlusCircle } from 'lucide-react';

export default function InventoryPage() {
  // Placeholder data
  const inventoryItems = [
    { id: 'P001', name: 'Oil Filter', quantity: 50, location: 'Shelf A1' },
    { id: 'P002', name: 'Brake Pads (Set)', quantity: 25, location: 'Bin B3' },
    { id: 'P003', name: 'Headlight Bulb', quantity: 100, location: 'Shelf A2' },
  ];

  const handleAdjust = (item: typeof inventoryItems[0]) => {
    console.log('Adjust item - ID:', item.id, 'Name:', item.name);
    // Placeholder: Open a modal or navigate to an edit page for item adjustment
  };

  const handleEdit = (item: typeof inventoryItems[0]) => {
    console.log('Edit item - ID:', item.id, 'Name:', item.name);
    // Placeholder: Open a modal or navigate to an edit page
  };

  const handleDelete = (item: typeof inventoryItems[0]) => {
    if (window.confirm(`Are you sure you want to delete ${item.name} (ID: ${item.id})?`)) {
      console.log('Delete item - ID:', item.id, 'Name:', item.name);
      // Placeholder: Call an API to delete the item and update state
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
       <div className="flex items-center justify-between gap-4">
           <div className="flex items-center gap-4">
               <Archive className="w-8 h-8 text-primary" />
               <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
       </div>


      {/* Add Item Form Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Inventory Item</CardTitle>
          <CardDescription>Enter details for the new stock item.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input id="itemName" placeholder="e.g., Oil Filter" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" type="number" placeholder="e.g., 50" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g., Shelf A1" />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="sku">SKU / Part Number</Label>
            <Input id="sku" placeholder="Optional SKU or Part #" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto">Save Item</Button>
        </CardFooter>
      </Card>

      {/* Inventory List Table */}
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
                     <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleAdjust(item)}>Adjust</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item)}>Delete</Button>
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
