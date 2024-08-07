
import { CalendarIcon, ChevronLeft, ChevronRight, Home, LineChart, LogOut, Package, Package2, Settings, ShoppingCart, Users2, } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import BarGraphReport from "./BarGraphReport";
import ChartReport from "./ChartReport";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import ShowSelectedReport from "./ShowSelectedReport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShowSelectedProduct from "./ShowSelectedProduct";
import CashierTab from "./CashierTab";
import AddProduct from "./AddProduct";
import UpdateBegginingBalance from "./UpdateBegginingBalance";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

export default function AdminDashboard({ className }) {

  const router = useRouter();

  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState({
    from: parseISO(today),
    to: parseISO(today),
  });
  const [begginingBalance, setBegginingBalance] = useState(0);
  const [zReports, setZReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [progress, setProgress] = useState(33);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showSelectedReport, setShowSelectedReport] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSelectedProduct, setShowSelectedProduct] = useState(false);
  const [thisMonthSales, setThisMonthSales] = useState(0);
  const [lastMonthSales, setLastMonthSales] = useState(0);

  const calculatePercentageSales = () => {
    if (lastMonthSales === 0) {
      return 0;
    }
    const percentage = ((thisMonthSales - lastMonthSales) / lastMonthSales) * 100;
    return percentage;
  };

  const percentageChange = calculatePercentageSales();
  const progressValue = Math.min(Math.abs(percentageChange), 100);


  const handleRowClick = (report) => {
    setSelectedReport(report);
    setShowSelectedReport(true);
  };
  const closeShowSelectedReport = () => {
    setShowSelectedReport(false);
  }

  const handleProductClick = (report) => {
    setSelectedProduct(report);
    setShowSelectedProduct(true);
  };

  const closeShowSelectedProduct = (returnedValue) => {
    setShowSelectedProduct(false);
    if (returnedValue === true) {
      getAllProduct();
    }
  }

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getZReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "sales.php";
      const formatDateForSQL = (inputDate) => {
        return format(new Date(inputDate), 'yyyy-MM-dd');
      };

      const jsonData = {
        from: date.from ? formatDateForSQL(date.from) : formatDateForSQL(date.to),
        to: date.to ? formatDateForSQL(date.to) : formatDateForSQL(date.from),
      };

      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "getZReportWithSelectedDate");

      const res = await axios.post(url, formData);
      console.log("AdminDashboard.js => getZReports() res: ", res);
      setZReports(res.data);
      setProgress(78);
    } catch (error) {
      toast.error("Something went wrong");
      console.log("AdminDashboard.js => getZReports() error: ", error);
    } finally {
      setTimeout(() => {
        setProgress(100);
      }, 500);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [date]);

  const getAllProduct = async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "products.php";
      const formData = new FormData();
      formData.append("operation", "getAllProduct");
      const res = await axios.post(url, formData);
      console.log("AdminDashboard.js => getAllProduct() res: ", res);
      setAllProducts(res.data);
      setProgress(78);
    } catch (error) {
      toast.error("Something went wrong");
      console.log("AdminDashboard.js => getAllProduct() error: ", error);
    } finally {
      setTimeout(() => {
        setProgress(100);
      }, 500);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleLogout = () => {
    router.push("/");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
  }

  const getBegginingBalance = async () => {
    try {
      const url = localStorage.getItem("url") + "users.php";
      const formData = new FormData();
      formData.append("operation", "getBeginningBalance");
      const res = await axios.post(url, formData);
      console.log("AdminDashboard.js => getBegginingBalance() res: ", res);
      setBegginingBalance(res.data.beginning_balance);
      setProgress(78);
    } catch (error) {
      toast.error("Something went wrong");
      console.log("AdminDashboard.js => getBegginingBalance() error: ", error);
    }

  }

  const getThisMonthSales = async () => {
    try {
      const url = localStorage.getItem("url") + "sales.php";
      const formData = new FormData();
      formData.append("operation", "getThisMonthSales");
      const res = await axios.post(url, formData);
      console.log("AdminDashboard.js => getThisMonthSales() res: ", res.data[0].totalAmount);
      setThisMonthSales(res.data[0].totalAmount);
      getLastMonthSales();
    } catch (error) {
      toast.error("Something went wrong");
      console.log("AdminDashboard.js => getThisMonthSales() error: ", error);
    }
  }

  const getLastMonthSales = async () => {
    try {
      const url = localStorage.getItem("url") + "sales.php";
      const formData = new FormData();
      formData.append("operation", "getLastMonthSales");
      const res = await axios.post(url, formData);
      console.log("AdminDashboard.js => getLastMonthSales() res: ", res);
      setLastMonthSales(res.data[0].totalAmount);
    } catch (error) {
      toast.error("Something went wrong");
      console.log("AdminDashboard.js => getLastMonthSales() error: ", error);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("url") !== "http://localhost/pos_backend/api/") {
      localStorage.setItem("url", "http://localhost/pos_backend/api/");
    }
    if (localStorage.getItem("isLoggedIn") !== "true" || localStorage.getItem("role") !== "admin") {
      router.push("/");
    }
    getZReports();
    getAllProduct();
    getBegginingBalance();
    getThisMonthSales();
  }, [getZReports]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(zReports) ? zReports.slice(indexOfFirstItem, indexOfLastItem) : [];

  const totalPages = Math.ceil(zReports.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          </header>
          <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <TooltipProvider>
              <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <LogOut className="h-4 w-4 scale-x-[-1] cursor-pointer" onClick={handleLogout} />
                  </TooltipTrigger>
                  <TooltipContent side="right">Log Out</TooltipContent>
                </Tooltip>
              </nav>
            </TooltipProvider>
          </aside>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                <Card className="sm:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle>Add Product</CardTitle>
                    <CardDescription className="max-w-sm text-balance leading-relaxed">
                      Add new product to the store
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <AddProduct refreshData={getAllProduct} />
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Cashier's Beggining Balance</CardDescription>
                    <CardTitle className="text-4xl">{begginingBalance + " Php"}</CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <UpdateBegginingBalance refreshData={getBegginingBalance} balance={begginingBalance} />
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>This Month</CardDescription>
                    <CardTitle className="text-4xl">{thisMonthSales + " Php"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      {percentageChange >= 0 ? (
                        <span className="text-green-500">
                          +{percentageChange.toFixed(2)}% from last month
                        </span>
                      ) : (
                        <span className="text-red-500">
                          {percentageChange.toFixed(2)}% from last month
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Progress value={progressValue} aria-label={`${Math.abs(percentageChange).toFixed(2)}% change`} />
                  </CardFooter>
                </Card>


              </div>

              <Card>
                <CardContent>
                  <Tabs className="mt-6" defaultValue="orders">
                    <div className="flex items-center mb-5">
                      <TabsList>
                        <TabsTrigger value="orders">Transactions</TabsTrigger>
                        <TabsTrigger value="products">Products</TabsTrigger>
                        <TabsTrigger value="cashiers">Cashiers</TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value="orders">
                      <div className="flex flex-row">
                        <div className="ml-auto">
                          <div className={cn("grid gap-2", className)}>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  id="date"
                                  variant={"outline"}
                                  className={cn(
                                    "w-[300px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {date?.from ? (
                                    date.to ? (
                                      <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                      </>
                                    ) : (
                                      format(date.from, "LLL dd, y")
                                    )
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  initialFocus
                                  mode="range"
                                  defaultMonth={date?.from}
                                  selected={date}
                                  onSelect={(selectedRange) => {
                                    if (selectedRange && selectedRange.from && selectedRange.to) {
                                      setDate(selectedRange);
                                    } else if (selectedRange && selectedRange.from) {
                                      setDate({ from: selectedRange.from, to: selectedRange.from });
                                    } else if (selectedRange && selectedRange.to) {
                                      setDate({ from: selectedRange.to, to: selectedRange.to });
                                    }
                                  }}
                                  numberOfMonths={2}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                      {isLoading ? (
                        <div className="flex flex-col items-center w-100">
                          <Progress value={progress} className="w-[80%] mb-3" />
                          <CardDescription>{"Getting data..."}</CardDescription>
                        </div>
                      ) : (
                        <>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Cashier Name</TableHead>
                                <TableHead className="hidden sm:table-cell">Date</TableHead>
                                <TableHead className="hidden md:table-cell">Time</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {currentItems.length > 0 ? currentItems.map((report, index) => (
                                <TableRow className="bg-accent cursor-pointer" key={index} onClick={() => { handleRowClick(report); }
                                }>
                                  <TableCell>
                                    <div className="font-medium">{report.user_username}</div>
                                  </TableCell>
                                  <TableCell className="hidden sm:table-cell">
                                    {formatDates(report.sale_date)}
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell">
                                    {formatTime(report.sale_date)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {report.sale_totalAmount}<span> Php</span>
                                  </TableCell>
                                </TableRow>
                              )) : (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center">
                                    No orders found
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                          {currentItems.length > 0 && (
                            <div className="flex justify-center mt-4">
                              <Pagination>
                                <PaginationContent>
                                  <PaginationItem
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                  >
                                    <ChevronLeft className="cursor-pointer" />
                                  </PaginationItem>
                                  {Array.from({ length: totalPages }, (_, index) => (
                                    <PaginationItem
                                      className="cursor-pointer"
                                      key={index + 1}
                                      onClick={() => handlePageChange(index + 1)}
                                      active={currentPage === index + 1}
                                    >
                                      {index + 1}
                                    </PaginationItem >
                                  ))}
                                  <PaginationItem
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                  >
                                    <ChevronRight className="cursor-pointer" />
                                  </PaginationItem>
                                </PaginationContent>
                              </Pagination>
                            </div>
                          )}
                        </>
                      )}
                    </TabsContent>
                    <TabsContent value="products">
                      {isLoading ? (
                        <div className="flex flex-col items-center w-100">
                          <Progress value={progress} className="w-[80%] mb-3" />
                          <CardDescription>{"Getting data..."}</CardDescription>
                        </div>
                      ) : (
                        <>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Barcode</TableHead>
                                <TableHead className="text-center">Product</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {allProducts.length > 0 ? allProducts.map((product, index) => (
                                <TableRow className="bg-accent cursor-pointer" key={index} onClick={() => { handleProductClick(product); }
                                }>
                                  <TableCell>
                                    <div className="font-medium">{product.prod_id}</div>
                                  </TableCell>
                                  <TableCell className="table-cell text-center">
                                    {product.prod_name}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {product.prod_price}<span> Php</span>
                                  </TableCell>
                                </TableRow>
                              )) : (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center">
                                    No orders found
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </>
                      )}
                    </TabsContent>
                    <TabsContent value="cashiers">
                      <CashierTab />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

            </div>
            <div>
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                  <div className="grid gap-0.5">

                    <CardTitle className="text-xl">
                      Product sold this month
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-3 text-sm">
                  <BarGraphReport />
                  <Separator className="my-4" />
                  <ChartReport />
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
      <ShowSelectedReport report={selectedReport} show={showSelectedReport} hide={closeShowSelectedReport} />
      <ShowSelectedProduct report={selectedProduct} show={showSelectedProduct} hide={closeShowSelectedProduct} />
    </>
  );
}

export function formatDates(inputDate) {
  const date = new Date(inputDate);
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

export function formatTime(inputDate) {
  const date = new Date(inputDate);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  return `${formattedTime}`;
}
