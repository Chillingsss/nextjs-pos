"use client"
import React, { useEffect, useState } from 'react';
import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatDates, formatTime } from './AdminDashboard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

function ShowSelectedReport({ report, show, hide }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (show && report) {
      setItems(report.items); // Ensure `items` is directly set from `report.items`
      console.log('Selected Report:', report);
    }
  }, [show, report]);

  if (!report) return null;

  return (
    <Dialog open={show} onOpenChange={hide}>
      <DialogContent className="max-w-[800px] max-h-[600px] overflow-auto mx-auto">
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
          <DialogDescription>
            View the details of the selected report here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue={report.user_username}
              className="col-span-2"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input
              id="date"
              defaultValue={formatDates(report.sale_date)}
              className="col-span-2"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              defaultValue={formatTime(report.sale_date)}
              className="col-span-2"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              defaultValue={`${report.sale_totalAmount} Php`}
              className="col-span-2"
              readOnly
            />
          </div>
          <Separator />
          <DialogTitle>Items</DialogTitle>
          {items.length > 0 && (
            <div className="w-full overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Product</TableHead>
                    <TableHead className="hidden sm:table-cell text-right">Price</TableHead>
                    <TableHead className="hidden md:table-cell text-right">Quantity</TableHead>
                    <TableHead className="hidden md:table-cell text-right">Cash Tendered</TableHead>
                    <TableHead className="hidden md:table-cell text-right">Change</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-left">
                        <div className="font-medium">{item.product_name}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-right">
                        {item.sale_item_price}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right">
                        {item.sale_item_quantity}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right">
                        {report.sale_cashTendered}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right">
                        {report.sale_change}
                      </TableCell>
                      <TableCell className="text-right">
                        {report.sale_totalAmount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShowSelectedReport;
