import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Truck, PlusCircle } from 'lucide-react';

export default function VehiclesPage() {
  // Placeholder data
  const vehicles = [
    { id: 'V001', make: 'Ford', model: 'Transit', year: 2022, status: 'Active' },
    { id: 'V002', make: 'Mercedes', model: 'Sprinter', year: 2021, status: 'Maintenance' },
    { id: 'V003', make: 'Chevrolet', model: 'Express', year: 2023, status: 'Active' },
  ];

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between gap-4">
         <div className="flex items-center gap-4">
             <Truck className="w-8 h-8 text-primary" />
             <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
         </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>

       {/* Add Vehicle Form Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Vehicle</CardTitle>
          <CardDescription>Enter the details for the new vehicle.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="make">Make</Label>
            <Input id="make" placeholder="e.g., Ford" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model">Model</Label>
            <Input id="model" placeholder="e.g., Transit" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="year">Year</Label>
            <Input id="year" type="number" placeholder="e.g., 2023" />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="vin">VIN</Label>
            <Input id="vin" placeholder="Vehicle Identification Number" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto">Save Vehicle</Button>
        </CardFooter>
      </Card>

      {/* Vehicle List Table */}
      <Card>
         <CardHeader>
            <CardTitle>Vehicle List</CardTitle>
            <CardDescription>Overview of all vehicles in the fleet.</CardDescription>
         </CardHeader>
         <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Make</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>{vehicle.id}</TableCell>
                    <TableCell>{vehicle.make}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.status}</TableCell>
                    <TableCell className="text-right">
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
