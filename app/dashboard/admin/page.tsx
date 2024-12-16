import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Users, IndianRupee } from "lucide-react";
import { MonthPicker } from "@/components/custom-ui/month-picker";
import AddStudentButton from "@/components/buttons/add-student-button";
import MonthlyStatsLoading from "@/components/skeletons/monthly-stats-skeleton";
import { Suspense } from "react";
import { PaymentsChart } from "@/components/custom-ui/chart";
import { getMonthlyPaymentsAndExpenses } from "@/app/actions/chartData";
import { InstrumentBreakdownChart } from "@/components/custom-ui/pie-chart";
import { PageProps } from "@/types";
import { getCombinedStats } from "@/app/actions/chartData";
import { StatCard } from "@/components/custom-ui/stat-card";
import { NoDataCard } from "@/components/custom-ui/no-data-card";
import { Heading } from "@/components/custom-ui/heading";

export default async function MonthlyStatsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const currentMonth = format(new Date(), "yyyy-MM");
  const selectedMonth = searchParams.month || currentMonth;
  const stats = await getCombinedStats(selectedMonth);
  const monthDisplay = format(new Date(selectedMonth), "MMMM yyyy");
  const chartData = await getMonthlyPaymentsAndExpenses();
  // const totalExpenses = chartData.reduce((sum, item) => sum + item.expenses, 0);

  return (
    <Suspense fallback={<MonthlyStatsLoading />}>
      <div className="w-[90vw] md:w-[75vw] my-10">
        <AddStudentButton />

        <div className="mb-8">
          <Heading size="md" className="mb-5">
            Statistics Dashboard
          </Heading>
          <MonthPicker defaultValue={selectedMonth} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {stats.hasData ? (
            <>
              <Card>
                <StatCard
                  title="Active Students"
                  value={stats.monthly.activeStudents}
                  yearlyValue={stats.yearly.activeStudents}
                  subtitle={`Active Students in ${monthDisplay}`}
                  icon={Users}
                />
                <InstrumentBreakdownChart
                  monthly={stats.monthly.instrumentBreakdown}
                />
              </Card>
              <Card>
                <div className="flex justify-between gap-y-2">
                  <StatCard
                    title="Total Payments"
                    value={stats.monthly.totalPayments}
                    yearlyValue={stats.yearly.totalPayments}
                    subtitle={`Collected in ${monthDisplay}`}
                    icon={IndianRupee}
                  />
                  <StatCard
                    title="Total Expenses"
                    value={stats.monthly.totalExpenses}
                    yearlyValue={stats.yearly.totalExpenses}
                    subtitle={`Expenses in ${monthDisplay}`}
                    icon={IndianRupee}
                  />
                </div>
                <PaymentsChart chartData={chartData} />
              </Card>
            </>
          ) : (
            <NoDataCard />
          )}
        </div>
      </div>
    </Suspense>
  );
}
