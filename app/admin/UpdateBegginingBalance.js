"use client"
import React, { useEffect, useState } from 'react';
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';

function UpdateBegginingBalance({ refreshData, balance }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUpdateBegginingBalance = async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "users.php";
      const formData = new FormData();
      const balance = document.getElementById('balance').value;
      if (!balance) {
        toast.error('Please fill in all fields');
        return;
      } else if (balance !== parseFloat(balance).toString()) {
        toast.error('Invalid balance');
        return;
      }
      const jsonData = {
        amount: balance
      }

      formData.append('operation', 'updateBeginningBalance');
      formData.append('json', JSON.stringify(jsonData));

      const res = await axios.post(url, formData);
      console.log('RES NI ADD PRODUCTRSAKERDL: :', res);
      if (res.data === 1) {
        toast.success('Beggining balance updated successfully');
        refreshData();
        setIsDialogOpen(false);
        return;
      } else {
        toast.success('No changes made');
        setIsDialogOpen(false);
        return;
      }

    } catch (error) {
      console.error('UpdateBegginingBalance => handleUpdateBegginingBalance :', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsDialogOpen(true)}>Update Beggining Balance</Button>
      </DialogTrigger>
      <DialogContent className="overflow-auto mx-auto">
        <DialogHeader>
          <DialogTitle>Update Beggining Balance</DialogTitle>
          <DialogDescription>
            Update the beggining balance.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="balance" className="text-right">
              Balance
            </Label>
            <Input
              id="balance"
              defaultValue={balance}
              className="col-span-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdateBegginingBalance} disabled={isLoading}>{isLoading ? 'Updating...' : 'Update'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateBegginingBalance;
