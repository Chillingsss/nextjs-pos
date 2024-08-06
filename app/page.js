"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from 'react';
import { ModeToggle } from "@/components/ui/mode-toggle";
import Barcode from "./barcode";
import KeybindsTable from "./keybinds-table";
import { toast } from "sonner";
import Report from "./reports";
import AdminDashboard from "./admin/AdminDashboard";

function Page() {
  // const products = [
  //   { barcode: "1001", product: "Instant Noodles", price: 55 },
  //   { barcode: "1002", product: "Canned Tuna", price: 72 },
  //   { barcode: "1003", product: "Rice (1kg)", price: 45 },
  //   { barcode: "1004", product: "Milk (1L)", price: 60 },
  //   { barcode: "1005", product: "Eggs (12 pcs)", price: 95 },
  //   { barcode: "1006", product: "Bread (Loaf)", price: 40 },
  //   { barcode: "1007", product: "Cooking Oil (500ml)", price: 85 },
  //   { barcode: "1008", product: "Sugar (1kg)", price: 50 },
  //   { barcode: "1009", product: "Coffee (200g)", price: 150 },
  //   { barcode: "1010", product: "Soy Sauce (500ml)", price: 38 },
  // ];

  // const [transactionForToday, setTransactionForToday] = useState([]);
  // const [selectedProducts, setSelectedProducts] = useState([]);
  // const [total, setTotal] = useState(0);
  // const [isCashInputVisible, setIsCashInputVisible] = useState(false);
  // const [isChangeVisible, setIsChangeVisible] = useState(false);
  // const [cashTendered, setCashTendered] = useState("");
  // const [customerChange, setCustomerChange] = useState(0);
  // const [isReportVisible, setIsReportVisible] = useState(false);

  // const handleAddProduct = (newProductSelected) => {
  //   const product = products.find(product => product.barcode === newProductSelected.barcode);
  //   if (product) {
  //     setSelectedProducts([...selectedProducts, { product: product.product, quantity: parseInt(newProductSelected.quantity), price: product.price }]);
  //     setTotal(total + product.price * parseInt(newProductSelected.quantity));
  //     toast.success("Product added");
  //   } else {
  //     toast.error("Product not found");
  //   }
  // };

  // useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     if (event.ctrlKey && event.key === 'F2') {
  //       if (selectedProducts.length > 0) {
  //         setIsCashInputVisible(!isCashInputVisible);
  //       } else {
  //         toast.error("No product selected yet");
  //       }
  //     } else if (isCashInputVisible && event.key === 'Enter') {
  //       if (parseInt(cashTendered) >= total) {
  //         setIsChangeVisible(true);
  //         setCustomerChange(parseInt(cashTendered) - total);
  //         toast.success("Successfully paid");
  //       } else {
  //         toast.error("Insufficient cash");
  //       }
  //     } else if (event.ctrlKey && event.key === 'F9') {
  //       if (selectedProducts.length > 0 && total > 0 && cashTendered !== "") {
  //         setTransactionForToday([...transactionForToday, { selectedProducts }]);
  //       }
  //       setIsChangeVisible(false);
  //       setIsCashInputVisible(false);
  //       setSelectedProducts([]);
  //       setTotal(0);
  //       setCashTendered("");
  //       setCustomerChange(0);
  //       toast.success("Transaction reset");
  //     } else if (event.ctrlKey && event.key === 'F3') {
  //       setIsReportVisible(!isReportVisible);
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [cashTendered, isCashInputVisible, isReportVisible, selectedProducts, total, transactionForToday]);
  // const computeQuantities = () => {
  //   const quantityMap = products.reduce((acc, product) => {
  //     acc[product.product] = 0;
  //     return acc;
  //   }, {});

  //   transactionForToday.forEach(transaction => {
  //     transaction.selectedProducts.forEach(product => {
  //       if (quantityMap[product.product] !== undefined) {
  //         quantityMap[product.product] += product.quantity;
  //       }
  //     });
  //   });

  //   return Object.keys(quantityMap).map(product => ({
  //     product,
  //     quantity: quantityMap[product]
  //   }));
  // };

  // const chartData = computeQuantities();

  return (
    <>
      <AdminDashboard />
      {/* <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">

            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <header>
                <ModeToggle />
                <Barcode handleAddProduct={handleAddProduct} />
              </header>
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>
                    Recent orders from your store.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table >
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden sm:table-cell">Product</TableHead>
                        <TableHead className="hidden sm:table-cell">Price</TableHead>
                        <TableHead className="hidden sm:table-cell">Quantity</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedProducts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">
                            No products selected yet
                          </TableCell>
                        </TableRow>
                      )}
                      {selectedProducts.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell className="hidden sm:table-cell">{product.product}</TableCell>
                          <TableCell className="hidden sm:table-cell">{product.price}<span> Php</span></TableCell>
                          <TableCell className="hidden sm:table-cell">{product.quantity}</TableCell>
                          <TableCell className="text-right">{product.price * product.quantity} <span>Php</span></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {isReportVisible && (
                <Report chartData={chartData} />
              )

              }

            </div>

            <div className="mt-2">
              <Card className="overflow-hidden mt-16" x-chunk="dashboard-05-chunk-4">
                <CardContent className="p-6 text-sm">
                  <div className="grid gap-3">
                    <div className="font-semibold text-2xl">Order Summary</div>
                    <Separator className="my-2" />
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground text-xl">Total</span>
                        <span className="text-muted-foreground text-xl">{total} <span>Php</span></span>
                      </li>
                      {isCashInputVisible && (
                        <>
                          <li className="flex items-center justify-between font-semibold">
                            <span className="text-muted-foreground text-xl">Customer Cash Tendered</span>
                            <span className="text-muted-foreground text-xl">
                              <Input
                                type="text"
                                placeholder="Enter cash tendered"
                                value={cashTendered}
                                onChange={(e) => setCashTendered(e.target.value)}
                                className="w-full border p-1"
                                autoFocus
                              />
                            </span>
                          </li>
                          {isChangeVisible && (
                            <>
                              <Separator className="my-2" />

                              <li className="flex items-center justify-between font-semibold">
                                <span className="text-muted-foreground text-xl">Change</span>
                                <span className="text-muted-foreground text-xl">
                                  {customerChange}
                                  <span> Php</span>
                                </span>
                              </li>
                            </>
                          )}
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <KeybindsTable />
            </div>
          </main>
        </div>
      </div> */}
    </>
  );
}

export default Page;
