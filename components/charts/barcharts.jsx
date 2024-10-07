"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};

export const BarCharts = ({ data, title }) => {
  return (
    <Card className="w-full h-full bg-woodsmoke-600/40">
      <CardHeader className="h-9 p-2">
        <CardTitle className="text-woodsmoke-200 font-cabinet text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              className="text-woodsmoke-200 font-satoshi text-sm"
              dataKey="acq_date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              color="#d7d8e0"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count_dos" fill="#d7d8e0" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

// Función para agrupar y promediar datos por fecha
const groupAndAverageByDate = (firms, key) => {
  const totalByDate = firms.reduce((acc, firm) => {
    const { acq_date } = firm;
    acc[acq_date] = acc[acq_date] || { total: 0, count: 0 };
    acc[acq_date].total += firm[key];
    acc[acq_date].count += 1;
    return acc;
  }, {});

  return Object.entries(totalByDate).map(([acq_date, { total, count }]) => ({
    acq_date,
    average: (total / count).toFixed(2), // Promedio formateado a 2 decimales
  }));
};