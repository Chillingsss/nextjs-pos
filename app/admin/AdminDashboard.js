import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft, ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import BarGraphReport from "./BarGraphReport"
import ChartReport from "./ChartReport"

export default function AdminDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const [zReports, setZReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);

  const getZReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = "http://localhost/pos_backend/api/sales.php";
      const jsonData = {
        date: selectedDate
      }
      console.log("jsonData: ", jsonData);
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "getZReportWithSelectedDate");

      const res = await axios.post(url, formData);
      console.log("AdminDashboard.js => getZReports() res: ", res);
      setZReports(res.data);
    } catch (error) {
      toast.error("Something went wrong");
      console.log("AdminDashboard.js => getZReports() error: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate])

  useEffect(() => {
    getZReports();
  }, [getZReports]);

  function formatTime(inputDate) {
    const date = new Date(inputDate);

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    return `${formattedTime}`;
  }

  function formatDates(inputDate) {
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

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card
                className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
              >
                <CardHeader className="pb-3">
                  <CardTitle>Your Orders</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Introducing Our Dynamic Orders Dashboard for Seamless
                    Management and Insightful Analysis.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button>Create New Order</Button>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription>This Week</CardDescription>
                  <CardTitle className="text-4xl">$1,329</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +25% from last week
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={25} aria-label="25% increase" />
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription>This Month</CardDescription>
                  <CardTitle className="text-4xl">$5,329</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +10% from last month
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={12} aria-label="12% increase" />
                </CardFooter>
              </Card>
            </div>
            <Tabs defaultValue="week">

              <TabsContent value="week">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>
                      Recent orders from your store.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cashier Name</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Date
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Time
                          </TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {zReports.map((report, index) => (
                          <>
                            <TableRow className="bg-accent cursor-pointer" key={index}>
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
                          </>
                        ))}
                      </TableBody >
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Card
              className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
            >
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  
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
  )
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
