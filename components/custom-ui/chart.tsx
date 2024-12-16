"use client";
// import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"; 
// import DateFormatter from "./custom-ui/date-format";

interface ChartDataProps {
  month: string;
  payments: number;
  expenses: number;
}

const chartConfig = {
  payments: {
    label: "Payments: ₹",
    color: "hsl(var(--chart-2))",
  },
  expenses: {
    label: "Expenses: ₹",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function PaymentsChart({ chartData }: { chartData: ChartDataProps[] }) {
  // Calculate total growth
  // const calculateGrowth = () => {
  //   if (chartData.length < 2) return 0;
  //   const firstMonth = chartData[0];
  //   const lastMonth = chartData[chartData.length - 1];

  //   const paymentsGrowth =
  //     ((lastMonth.payments - firstMonth.payments) / firstMonth.payments) * 100;
  //   return paymentsGrowth.toFixed(1);
  // };

  // const calculateExpenses = () => {
  //   if (chartData.length < 2) return 0;
  //   const firstMonth = chartData[0];
  //   const lastMonth = chartData[chartData.length - 1];

  //   const expensesGrowth =
  //     ((lastMonth.expenses - firstMonth.expenses) / firstMonth.expenses) * 100;
  //   return expensesGrowth.toFixed(1);
  // };

  // Calculate total payments
  const totalPayments = chartData.reduce((sum, item) => sum + item.payments, 0);
  const totalExpenses = chartData.reduce((sum, item) => sum + item.expenses, 0);
  const difference = totalPayments - totalExpenses;

  return (
    <>
      <CardHeader>
        <CardTitle>Monthly Payments vs Expenses</CardTitle>
        <CardDescription>Monthly payment and expenses overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8} 
              tickFormatter={(value) =>  value.slice(5, 7)}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="payments"
              type="natural"
              fill="var(--color-payments)"
              fillOpacity={0.4}
              stroke="var(--color-payments)"
            />
            <Area
              dataKey="expenses"
              type="natural"
              fill="var(--color-expenses)"
              fillOpacity={0.4}
              stroke="var(--color-expenses)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-between items-center gap-2 text-sm">
          {/* <div className="flex justify-evenly gap-4"> */}
            <div className="flex items-center gap-2 leading-none text-active">
              Total Payments: ₹{totalPayments.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 leading-none text-destructive">
              Total Expenses: ₹{totalExpenses.toLocaleString()}
            </div>
            <div
              className={`flex items-center gap-2 leading-none ${
                difference >= 0 ? "text-active" : "text-destructive"
              }`}
            >
              Difference: ₹
              {(difference > 0 ? "+" : "-") + difference.toLocaleString()}
            </div>
          {/* </div> */}
        </div>
      </CardFooter>
      {/* <div className="flex w-full items-start gap-2 text-sm m-5">
        Trending up by {calculateGrowth()}% <TrendingUp className="h-4 w-4" />
        Trending up by {calculateExpenses()}% <TrendingUp className="h-4 w-4" />
      </div> */}
    </>
  );
}


// "use client"

// import { TrendingUp } from "lucide-react"
// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"
// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ]

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "hsl(var(--chart-1))",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "hsl(var(--chart-2))",
//   },
// } satisfies ChartConfig

// export function Component() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Area Chart - Stacked</CardTitle>
//         <CardDescription>
//           Showing total visitors for the last 6 months
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <AreaChart
//             accessibilityLayer
//             data={chartData}
//             margin={{
//               left: 12,
//               right: 12,
//             }}
//           >
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="month"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               tickFormatter={(value) => value.slice(0, 3)}
//             />
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent indicator="dot" />}
//             />
//             <Area
//               dataKey="mobile"
//               type="natural"
//               fill="var(--color-mobile)"
//               fillOpacity={0.4}
//               stroke="var(--color-mobile)"
//               stackId="a"
//             />
//             <Area
//               dataKey="desktop"
//               type="natural"
//               fill="var(--color-desktop)"
//               fillOpacity={0.4}
//               stroke="var(--color-desktop)"
//               stackId="a"
//             />
//           </AreaChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter>
//         <div className="flex w-full items-start gap-2 text-sm">
//           <div className="grid gap-2">
//             <div className="flex items-center gap-2 font-medium leading-none">
//               Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//             </div>
//             <div className="flex items-center gap-2 leading-none text-muted-foreground">
//               January - June 2024
//             </div>
//           </div>
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }
