import { CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import React, { useState } from 'react'
import { Area, AreaChart, XAxis, YAxis } from 'recharts'

function ChartReport() {
  const [data, setData] = useState([]);

  const getTotalAmount = () => {
    try {
      
    } catch (error) {

    } finally {

    }
  };

  return (
    <>
      <div>

        <CardDescription>{"This month's total sales"}</CardDescription>
      </div>
      <div>
        <div className="flex items-baseline gap-1 text-4xl tabular-nums">
          1000
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
            accessibilityLayer
            data={[
              {
                date: "2024-01-01",
                time: 8.5,
              },
              {
                date: "2024-01-02",
                time: 7.2,
              },
              {
                date: "2024-01-03",
                time: 8.1,
              },
              {
                date: "2024-01-04",
                time: 6.2,
              },
              {
                date: "2024-01-05",
                time: 5.2,
              },
              {
                date: "2024-01-06",
                time: 8.1,
              },
              {
                date: "2024-01-07",
                time: 7.0,
              },
              {
                date: "2024-01-08",
                time: 8.5,
              },
              {
                date: "2024-01-09",
                time: 7.2,
              },
              {
                date: "2024-01-10",
                time: 8.1,
              },
              {
                date: "2024-01-11",
                time: 6.2,
              },
              {
                date: "2024-01-12",
                time: 5.2,
              },
              {
                date: "2024-01-13",
                time: 8.1,
              },
              {
                date: "2024-01-14",
                time: 7.0,
              },
            ]}
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="date" hide />
            <YAxis domain={["dataMin - 5", "dataMax + 2"]} hide />
            <defs>
              <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="time"
              type="natural"
              fill="url(#fillTime)"
              fillOpacity={0.4}
              stroke="var(--color-time)"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              formatter={(value) => (
                <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                  Dec 1 2023
                  <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                    {value}
                    <span className="font-normal text-muted-foreground">
                      php
                    </span>
                  </div>
                </div>
              )}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </>
  )
}

export default ChartReport
