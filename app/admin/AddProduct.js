"use client"
import React, { useState } from 'react';
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';

function AddProduct({ refreshData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddProduct = async () => {
    setIsLoading(true);
    try {
      const url = 'http://localhost/pos_backend/api/products.php';
      const formData = new FormData();
      const barcode = document.getElementById('barcode').value;
      const name = document.getElementById('name').value;
      const price = document.getElementById('price').value;
      if (!barcode || !name || !price) {
        toast.error('Please fill in all fields');
        return;
      } else if (price !== parseFloat(price).toString()) {
        toast.error('Invalid price');
        return;
      }
      const jsonData = {
        barcode: barcode,
        productName: name,
        price: price
      }

      formData.append('operation', 'addProduct');
      formData.append('json', JSON.stringify(jsonData));

      const res = await axios.post(url, formData);
      console.log('RES NI ADD PRODUCTRSAKERDL: :', res);
      if (res.data === -1) {
        toast.error('Barcode already exists');
        return;
      } else if (res.data === -2) {
        toast.error('Product name already exists');
        return;
      } else if (res.data === 1) {
        toast.success('Product added successfully');
        refreshData();
        setIsDialogOpen(false); 
        return;
      } else {
        toast.error('Error adding product');
        return;
      }

    } catch (error) {
      console.error('AddProduct => handleAddProduct :', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsDialogOpen(true)}>Add Product</Button>
      </DialogTrigger>
      <DialogContent className="overflow-auto mx-auto">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Add a new product to the store.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="barcode" className="text-right">
              Barcode
            </Label>
            <Input
              id="barcode"
              defaultValue={""}
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue={""}
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              defaultValue={""}
              className="col-span-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddProduct} disabled={isLoading}>{isLoading ? 'Submitting...' : 'Submit'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddProduct;
