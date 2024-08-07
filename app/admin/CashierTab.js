import { CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import axios from 'axios';

// import { formatDates } from './AdminDashboard';
// import { cn } from '@/lib/utils';
// import { format, parseISO } from 'date-fns';
// import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
// import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';

function CashierTab() {
  // const today = new Date().toISOString().split('T')[0];
  // const [date, setDate] = useState({
  //   from: parseISO(today),
  //   to: parseISO(today),
  // });
  // const [zReports, setZReports] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(33);

  const getAllCashiers = async () => {
    setIsLoading(true);
    try {
      const url = "http://localhost/pos_backend/api/users.php";
      const formData = new FormData();
      formData.append("operation", "getAllCashiers");
      const response = await axios.post(url, formData);
      console.log("CashierTab.js => getAllCashiers() response: ", response.data);
      setCashiers(response.data);
      setProgress(76);
    } catch (error) {
      toast.error("Something went wrong");
      console.log("CashierTab.js => getAllCashiers() error: ", error);
    } finally {
      setTimeout(() => {
        setProgress(100);
      }, 500)
      setTimeout(() => {
        setIsLoading(false);
      }, 1000)
    }
  };

  useEffect(() => {
    getAllCashiers();
  }, []);

  return (
    <div>
      {/* <div className="flex flex-row">
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
      </div> */}
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
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-right">Contact Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cashiers.length > 0 ? cashiers.map((report, index) => (
                <TableRow className="bg-accent cursor-pointer" key={index} onClick={() => { handleRowClick(report); }
                }>
                  <TableCell>
                    <div className="font-medium">{report.user_username}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">{report.user_email}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div >{report.user_contactNumber}</div>
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
    </div>
  )
}

export default CashierTab
