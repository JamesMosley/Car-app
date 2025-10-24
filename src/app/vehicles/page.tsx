
"use client";

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, PlusCircle, Edit, Trash2, Search } from 'lucide-react';

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number | string;
  vin: string;
  status: 'Active' | 'Maintenance' | 'Inactive' | string;
};

const initialVehicles: Vehicle[] = [
  { id: 'V001', make: 'Ford', model: 'Transit', year: 2022, vin: '1FTRECHARGEEXPRESSA', status: 'Active' },
  { id: 'V002', make: 'Mercedes', model: 'Sprinter', year: 2021, vin: 'WDBRECHARGEEXPRESSB', status: 'Maintenance' },
  { id: 'V003', make: 'Chevrolet', model: 'Express', year: 2023, vin: '1GCGSRECHARGEEXPRESSC', status: 'Active' },
  { id: 'V004', make: 'RAM', model: 'ProMaster', year: 2022, vin: 'RAMPROMASTEREXPRESSD', status: 'Inactive' },
  { id: 'V005', make: 'Ford', model: 'E-Transit', year: 2023, vin: '1FTETRANSITEEXPRESSE', status: 'Active' },
  { id: 'V006', make: 'Nissan', model: 'NV200', year: 2020, vin: 'NISSANNV200EXPRESSF', status: 'Maintenance' },
  { id: 'V007', make: 'GMC', model: 'Savana', year: 2022, vin: 'GMCSAVANAEXPRESSG', status: 'Active' },
  { id: 'V008', make: 'Ford', model: 'Transit Connect', year: 2021, vin: '1FTCONNECTEXPRESSH', status: 'Inactive' },
  { id: 'V009', make: 'Mercedes', model: 'Metris', year: 2023, vin: 'WDBMETRISEXPRESSI', status: 'Active' },
  { id: 'V010', make: 'Chevrolet', model: 'City Express', year: 2019, vin: '1GCCITYEXPRESSJ', status: 'Maintenance' },
  { id: 'V011', make: 'Toyota', model: 'HiAce', year: 2022, vin: 'TOYHIACEEXPRESSK', status: 'Active' },
  { id: 'V012', make: 'Volkswagen', model: 'Crafter', year: 2023, vin: 'VWCRAFTEREXPRESSL', status: 'Maintenance' },
];

const ITEMS_PER_PAGE = 10;

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItemToEdit, setCurrentItemToEdit] = useState<Vehicle | null>(null);
  const [editFormState, setEditFormState] = useState<Omit<Vehicle, 'id'>>({ make: '', model: '', year: '', vin: '', status: 'Active' });
  const [addFormState, setAddFormState] = useState<Omit<Vehicle, 'id'>>({ make: '', model: '', year: '', vin: '', status: 'Active' });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAddFormState(prev => ({ ...prev, [id]: id === 'year' ? (value === '' ? '' : Number(value)) : value }));
  };
  
  const handleAddSelectChange = (value: string) => {
    setAddFormState(prev => ({ ...prev, status: value }));
  };

  const handleAddVehicle = () => {
    if (!addFormState.make || !addFormState.model || addFormState.year === '' || !addFormState.vin) {
      alert('Please fill in all fields for the new vehicle.');
      return;
    }
    const newVehicle: Vehicle = {
      id: `V${Date.now()}`,
      ...addFormState,
      year: Number(addFormState.year),
    };
    setVehicles(prev => [newVehicle, ...prev]); // Add to beginning to see it easily
    setAddFormState({ make: '', model: '', year: '', vin: '', status: 'Active' }); // Reset form
  };

  const openEditModal = (vehicle: Vehicle) => {
    setCurrentItemToEdit(vehicle);
    setEditFormState({ make: vehicle.make, model: vehicle.model, year: vehicle.year, vin: vehicle.vin, status: vehicle.status });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditFormState(prev => ({ ...prev, [id]: id === 'year' ? (value === '' ? '' : Number(value)) : value }));
  };

  const handleEditSelectChange = (value: string) => {
    setEditFormState(prev => ({ ...prev, status: value }));
  };

  const handleSaveEdit = () => {
    if (!currentItemToEdit || !editFormState.make || !editFormState.model || editFormState.year === '' || !editFormState.vin) {
      alert('Please fill in all fields.');
      return;
    }
    setVehicles(prevVehicles =>
      prevVehicles.map(v =>
        v.id === currentItemToEdit.id ? { ...v, ...editFormState, year: Number(editFormState.year) } : v
      )
    );
    setIsEditModalOpen(false);
    setCurrentItemToEdit(null);
  };

  const handleDelete = (vehicleToDelete: Vehicle) => {
    if (window.confirm(`Are you sure you want to delete ${vehicleToDelete.make} ${vehicleToDelete.model} (ID: ${vehicleToDelete.id})?`)) {
      const updatedVehicles = vehicles.filter(v => v.id !== vehicleToDelete.id);
      setVehicles(updatedVehicles);
      // Recalculate total pages and adjust current page if necessary
      const newFilteredVehicles = updatedVehicles.filter(vehicle =>
        [vehicle.make, vehicle.model, vehicle.vin, vehicle.status, vehicle.year.toString()].some(field =>
          field.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      const newTotalPages = Math.ceil(newFilteredVehicles.length / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }
      console.log('Deleted vehicle - ID:', vehicleToDelete.id, 'Make:', vehicleToDelete.make);
    }
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle =>
      [vehicle.make, vehicle.model, vehicle.vin, vehicle.status, vehicle.year.toString()].some(field =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [vehicles, searchTerm]);

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentVehicles = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);

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
          <Truck className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Vehicle</CardTitle>
          <CardDescription>Enter the details for the new vehicle.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="make">Make</Label>
            <Input id="make" placeholder="e.g., Ford" value={addFormState.make} onChange={handleAddInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model">Model</Label>
            <Input id="model" placeholder="e.g., Transit" value={addFormState.model} onChange={handleAddInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="year">Year</Label>
            <Input id="year" type="number" placeholder="e.g., 2023" value={addFormState.year} onChange={handleAddInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vin">VIN</Label>
            <Input id="vin" placeholder="Vehicle Identification Number" value={addFormState.vin} onChange={handleAddInputChange} />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="status_add">Status</Label>
            <Select value={addFormState.status} onValueChange={handleAddSelectChange}>
              <SelectTrigger id="status_add">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={handleAddVehicle}>
            <PlusCircle className="mr-2 h-4 w-4" /> Save Vehicle
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Vehicle List</CardTitle>
              <CardDescription>Overview of all vehicles. Search by make, model, year, VIN, or status.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
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
                <TableHead>ID</TableHead>
                <TableHead>Make</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>VIN</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentVehicles.length > 0 ? (
                currentVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>{vehicle.id}</TableCell>
                    <TableCell>{vehicle.make}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>{vehicle.year.toString()}</TableCell>
                    <TableCell>{vehicle.vin}</TableCell>
                    <TableCell>{vehicle.status}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(vehicle)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(vehicle)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No vehicles found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {totalPages > 0 && (
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredVehicles.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredVehicles.length)} of {filteredVehicles.length} vehicles.
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

      {/* Edit Vehicle Modal */}
      {currentItemToEdit && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Vehicle: {currentItemToEdit.make} {currentItemToEdit.model}</DialogTitle>
              <DialogDescription>Modify the vehicle details below.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_make" className="text-right">Make</Label>
                <Input id="edit_make" name="make" value={editFormState.make} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_model" className="text-right">Model</Label>
                <Input id="edit_model" name="model" value={editFormState.model} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_year" className="text-right">Year</Label>
                <Input id="edit_year" name="year" type="number" value={editFormState.year} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_vin" className="text-right">VIN</Label>
                <Input id="edit_vin" name="vin" value={editFormState.vin} onChange={handleEditInputChange} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_status" className="text-right">Status</Label>
                <Select value={editFormState.status} onValueChange={handleEditSelectChange}>
                  <SelectTrigger id="edit_status" className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
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

    