"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  }
}

export default function BarGraphReport() {
  const [chartData, setChartData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(33);

  const getBoughtProductsForThisMonth = async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "sales.php";
      const formData = new FormData();
      formData.append("operation", "getBoughtProductsForThisMonth");
      const res = await axios.post(url, formData);
      console.log("BarGraphReport.js => getBoughtProductsForThisMonth() res: ", res);
      setChartData(res.data);

      setProgress(66);

    } catch (error) {
      toast.error("Something went wrong");
      console.log("BarGraphReport.js => getBoughtProductsForThisMonth() error: ", error);
    } finally {
      setTimeout(() => {
        setProgress(100);
      }, 500)
      setTimeout(() => {
        setIsLoading(false);
      }, 1000)
    }
  }

  useEffect(() => {
    getBoughtProductsForThisMonth();

  }, [])
  return (
    <><div>
      {isLoading ?
        <div className="flex flex-col items-center w-100">
          <Progress value={progress} className="w-[80%] mb-3" />
          <CardDescription>{"Getting data..."}</CardDescription>
        </div>
        : <ChartContainer config={chartConfig} className="w-full ">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <YAxis />
            <XAxis
              dataKey="prod_name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 6)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="Sold" fill="var(--color-desktop)" radius={4} />
          </BarChart>
        </ChartContainer>}

    </div>
    </>
  )
}
