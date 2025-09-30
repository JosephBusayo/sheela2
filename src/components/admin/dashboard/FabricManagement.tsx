"use client";

import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FabricSample } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { set } from 'date-fns';

interface FabricManagementProps {
  fabricSamples: FabricSample[];
  onAddFabric: (name: string, image: File) => Promise<void>;
  onDeleteFabric: (id: string) => Promise<void>;
}

export const FabricManagement: React.FC<FabricManagementProps> = ({ fabricSamples, onAddFabric, onDeleteFabric }) => {
  const [newFabricName, setNewFabricName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newFabricImage, setNewFabricImage] = useState<File | null>(null);
  const [isAddFabricDialogOpen, setIsAddFabricDialogOpen] = useState(false);

  const handleAddFabric = async () => {
    if (!newFabricName.trim() || !newFabricImage) {
      toast.error('Please provide a name and an image for the fabric sample.');
      return;
    }

    setIsLoading(true);
    try {
      await onAddFabric(newFabricName, newFabricImage);
      setNewFabricName('');
      setNewFabricImage(null);
      setIsAddFabricDialogOpen(false);
      toast.success('Fabric sample added successfully.');
    } catch (error) {
      toast.error('Failed to add fabric sample.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFabric = async (id: string) => {
    try {
      await onDeleteFabric(id);
      toast.success('Fabric sample deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete fabric sample.');
    }
  };

  return (
    
    <div className="space-y-6">
      <h1 className='text-2xl font-bold text-center mb-4 text-gray-600 tracking-wider'>
        Fabric Management
      </h1>
      <div className="flex justify-end">

        <Dialog open={isAddFabricDialogOpen} onOpenChange={setIsAddFabricDialogOpen}>
          <DialogTrigger asChild>
            <Button 
            disabled={isLoading}
            className='cursor-pointer'>{isLoading ? <Loader2 className='animate-spin'/> : "Add Fabric Sample"}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Fabric Sample</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Fabric Name"
                value={newFabricName}
                onChange={(e) => setNewFabricName(e.target.value)}
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setNewFabricImage(e.target.files ? e.target.files[0] : null)}
              />
              <Button onClick={handleAddFabric}
disabled={isLoading}
              >{isLoading ? <Loader2 className='animate-spin'/> : "Add Fabric"}
</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fabricSamples.map((fabric) => (
            <TableRow key={fabric.id}>
              <TableCell>
                <img src={fabric.image} alt={fabric.name} className="h-16 w-16 object-cover" />
              </TableCell>
              <TableCell>{fabric.name}</TableCell>
              <TableCell>
                <Button variant="destructive" 
                className="cursor-pointer"
                onClick={() => handleDeleteFabric(fabric.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
