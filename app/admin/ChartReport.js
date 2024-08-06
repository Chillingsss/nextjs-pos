import { CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Area, AreaChart, XAxis, YAxis, Tooltip } from 'recharts';
import { toast } from 'sonner';

function formatDates(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatShortDate(dateString) {
  const options = { month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function ChartReport() {
  const [data, setData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getTotalAmountForCurrentMonth = async () => {
    setIsLoading(true);
    try {
      const url = "http://localhost/pos_backend/api/sales.php";
      const formData = new FormData();
      formData.append("operation", "getTotalAmountForCurrentMonth");
      const res = await axios.post(url, formData);
      const fetchedData = res.data;

      const totalAmountThisMonth = fetchedData.reduce((acc, curr) => acc + parseFloat(curr.totalAmount), 0);
      setData(fetchedData);
      setTotalAmount(totalAmountThisMonth);

      console.log("ChartReport.js => getTotalAmountForCurrentMonth() res: ", res);
    } catch (error) {
      toast.error("Something went wrong");
      console.log("ChartReport.js => getTotalAmountForCurrentMonth() error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTotalAmountForCurrentMonth();
  }, []);

  return (
    <>
      <div>
        <CardDescription>{"This month's total sales"}</CardDescription>
      </div>
      <div>
        <div className="flex items-baseline gap-1 text-4xl tabular-nums mb-5">
          {totalAmount}
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            Php
          </span>
        </div>
        <ChartContainer
          config={{
            time: {
              label: "Time",
              color: "hsl(var(--chart-2))",
            },
          }}
        >
          <AreaChart
            width={730}
            height={250}
            data={data}
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="date" tickFormatter={formatShortDate} />
            <YAxis />
            <Tooltip
              content={<ChartTooltipContent hideLabel />}
              formatter={(value, name, props) => (
                <div className="flex flex-col items-start text-xs text-muted-foreground">
                  <span>{formatDates(props.payload.date)}</span>
                  <div className="flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                    {value}
                    <span className="font-normal text-muted-foreground">
                      php
                    </span>
                  </div>
                </div>
              )}
            />
            <defs>
              <linearGradient id="fillTotalAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-time)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-time)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="totalAmount"
              type="monotone"
              fill="url(#fillTotalAmount)"
              fillOpacity={0.4}
              stroke="var(--color-time)"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </>
  );
}

export default ChartReport;
