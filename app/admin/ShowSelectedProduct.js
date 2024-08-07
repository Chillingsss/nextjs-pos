"use client"
import React, { useEffect, useState } from 'react';
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatDates, formatTime } from './AdminDashboard';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';

function ShowSelectedProduct({ report, show, hide }) {
  const [isLoading, setIsLoading] = useState(false);

  if (!report) return null;

  const handleUpdateProduct = async () => {
    setIsLoading(true);
    try {
      const url = 'http://localhost/pos_backend/api/products.php';
      const formData = new FormData();
      const name = document.getElementById('name').value;
      const price = document.getElementById('price').value;
      const jsonData = {
        product_id: report.prod_id,
        productName: name,
        price: price
      }

      formData.append('operation', 'updateProduct');
      formData.append('json', JSON.stringify(jsonData));

      const res = await axios.post(url, formData);
      if(res.data !== 0){
        toast.success('Product updated successfully');
      }

    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setIsLoading(false);
      hide();
    }
  };

  return (
    <Dialog open={show} onOpenChange={hide}>
      <DialogContent className="overflow-auto mx-auto">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            View and edit the details of the selected product.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Product
            </Label>
            <Input
              id="name"
              defaultValue={report.prod_name}
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              defaultValue={`${report.prod_price}`}
              className="col-span-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={hide}>Close</Button>
          <Button onClick={handleUpdateProduct} disabled={isLoading}>{isLoading ? 'Updating...' : 'Update'}</Button>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  );
}

export default ShowSelectedProduct;
