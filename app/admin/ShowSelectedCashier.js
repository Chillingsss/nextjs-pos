"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatDates, formatTime } from './AdminDashboard';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import ShowSelectedReport from './ShowSelectedReport';

function ShowSelectedCashier({ report, show, hide }) {
  const today = new Date().toISOString().split('T')[0];
  const [progress, setProgress] = useState(33);
  const [date, setDate] = useState({
    from: parseISO(today),
    to: parseISO(today),
  });
  const [zReports, setZReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedReport, setSelectedReport] = useState(null);
  const [showSelectedReport, setShowSelectedReport] = useState(false);


  const handleRowClick = (report) => {
    console.log("reports nimo: ", report);
    setSelectedReport(report);
    setShowSelectedReport(true);
  };
  const closeShowSelectedReport = () => {
    setShowSelectedReport(false);
    setSelectedReport(null);
  }

  const handleGetReports = useCallback(async () => {
    if (!report) return;

    setIsLoading(true);
    try {
      const url = 'http://localhost/pos_backend/api/sales.php';
      const formatDateForSQL = (inputDate) => {
        return format(new Date(inputDate), 'yyyy-MM-dd');
      };
      const jsonData = {
        userId: report.user_id,
        from: date.from ? formatDateForSQL(date.from) : formatDateForSQL(date.to),
        to: date.to ? formatDateForSQL(date.to) : formatDateForSQL(date.from),
      };
      console.log("JSONDATA NI handleGetReports", JSON.stringify(jsonData));
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "getShiftReport");

      const response = await axios.post(url, formData);
      console.log("DATA NI handleGetReports", response.data);
      setZReports(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, [date.from, date.to, report]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (show) {
      handleGetReports();
    }
  }, [handleGetReports, show, report]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(zReports) ? zReports.slice(indexOfFirstItem, indexOfLastItem) : [];

  const totalPages = Math.ceil(zReports.length / itemsPerPage);

  if (!report) return null;

  return (
    <>
      <Dialog open={show} onOpenChange={hide}>
        <DialogContent className="overflow-auto mx-auto">
          <DialogHeader>
            <DialogTitle>{report.user_fullName + "'s Report"}</DialogTitle>
            <DialogDescription>
              View report for {formatDates(date.from)} - {formatDates(date.to)}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row">
            <div className="ml-auto">
              <div className={cn("grid gap-2")}>
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
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Time</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? currentItems.map((report, index) => (
                    <TableRow className="bg-accent cursor-pointer" key={index} onClick={() => { handleRowClick(report); }
                    }>
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
          <DialogFooter>
            <Button variant="secondary" onClick={() => hide(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ShowSelectedReport report={selectedReport} show={showSelectedReport} hide={closeShowSelectedReport} />
    </>
  );
}

export default ShowSelectedCashier;
