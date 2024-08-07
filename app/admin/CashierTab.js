import { CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import axios from 'axios';
import ShowSelectedCashier from './ShowSelectedCashier';

function CashierTab() {

  const [cashiers, setCashiers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(33);
  const [report, setReport] = useState(null);
  const [showSelectedReport, setShowSelectedReport] = useState(false);


  const getAllCashiers = async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "users.php";
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

  const handleRowClick = (report) => {
    console.log("reports nimo: ", report);
    setReport(report);
    setShowSelectedReport(true);
  };
  const closeShowSelectedReport = () => {
    setShowSelectedReport(false);
    setReport(null);
  }

  useEffect(() => {
    getAllCashiers();
  }, []);

  return (
    <>
      <div>
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
                      <div className="font-medium">{report.user_fullName}</div>
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
      <ShowSelectedCashier report={report} show={showSelectedReport} hide={closeShowSelectedReport} />
    </>
  )
}

export default CashierTab
