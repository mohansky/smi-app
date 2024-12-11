import { format, startOfMonth, endOfMonth, subYears } from "date-fns";
import { db } from "@/db/drizzle";
import { sql } from "drizzle-orm";
import { students, payments, INSTRUMENTS } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Ban, Guitar, Drum, Piano, IndianRupee } from "lucide-react";
import { MonthPicker } from "@/components/custom-ui/month-picker";
// import { Container } from "@/components/custom-ui/container";
import AddStudentButton from "@/components/buttons/add-student-button";
import MonthlyStatsLoading from "@/components/skeletons/monthly-stats-skeleton";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ month?: string }>;
}

type InstrumentType = (typeof INSTRUMENTS)[keyof typeof INSTRUMENTS];

// Update INSTRUMENT_ICONS to match the case of INSTRUMENTS enum
const INSTRUMENT_ICONS: Record<InstrumentType, React.ElementType> = {
  guitar: Guitar,
  drums: Drum,
  keyboard: Piano,
};

interface InstrumentCount {
  instrument: string;
  count: number;
}

interface Stats {
  activeStudents: number;
  totalPayments: number;
  instrumentBreakdown: InstrumentCount[];
}

interface CombinedStats {
  monthly: Stats;
  yearly: Stats;
  hasData: boolean;
}

async function getCombinedStats(month: string): Promise<CombinedStats> {
  const selectedDate = new Date(month);
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const yearStart = startOfMonth(subYears(selectedDate, 1));

  // Get active students and their instruments for the month
  const activeStudents = await db
    .select({
      id: students.id,
      instrument: students.instrument,
    })
    .from(students)
    .where(sql`is_active = true AND joining_date <= ${monthEnd}`);

  // Get active students for the past year
  const yearlyActiveStudents = await db
    .select({
      id: students.id,
      instrument: students.instrument,
    })
    .from(students)
    .where(
      sql`is_active = true AND joining_date <= ${monthEnd} AND joining_date >= ${yearStart}`
    );

  // Get monthly payments
  const monthlyPayments = await db
    .select({
      total: sql`SUM(amount)::numeric`,
    })
    .from(payments).where(sql`
        date >= ${monthStart} AND 
        date <= ${monthEnd} AND 
        payment_status = 'PAID'
      `);

  // Get yearly payments
  const yearlyPayments = await db
    .select({
      total: sql`SUM(amount)::numeric`,
    })
    .from(payments).where(sql`
        date >= ${yearStart} AND 
        date <= ${monthEnd} AND 
        payment_status = 'PAID'
      `);

  // Calculate instrument breakdowns
  const monthlyInstrumentCounts = Object.values(INSTRUMENTS).map(
    (instrument) => ({
      instrument,
      count: activeStudents.filter(
        (student) => student.instrument === instrument
      ).length,
    })
  );

  const yearlyInstrumentCounts = Object.values(INSTRUMENTS).map(
    (instrument) => ({
      instrument,
      count: yearlyActiveStudents.filter(
        (student) => student.instrument === instrument
      ).length,
    })
  );

  const hasData =
    activeStudents.length > 0 || Number(monthlyPayments[0]?.total) > 0;

  return {
    monthly: {
      activeStudents: activeStudents.length,
      totalPayments: Number(monthlyPayments[0]?.total || 0),
      instrumentBreakdown: monthlyInstrumentCounts,
    },
    yearly: {
      activeStudents: yearlyActiveStudents.length,
      totalPayments: Number(yearlyPayments[0]?.total || 0),
      instrumentBreakdown: yearlyInstrumentCounts,
    },
    hasData,
  };
}

function NoDataCard() {
  return (
    <Card className="col-span-full">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <Ban className="h-12 w-12 text-muted-foreground" />
          <div className="text-xl font-medium text-muted-foreground">
            No Data Available
          </div>
          <p className="text-sm text-muted-foreground">
            There are no active students or payments recorded for this period.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  yearlyValue,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ElementType;
  yearlyValue: number;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold">
            {title.includes("Payments") ? "₹" : ""}
            {value.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
          <div className="flex items-center space-x-1 text-xs">
            <span>
              Yearly Total: {title.includes("Payments") ? "₹" : ""}
              {yearlyValue.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InstrumentBreakdown({ monthly }: { monthly: InstrumentCount[] }) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Students by Instrument
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {monthly.map(({ instrument, count }) => {
            const Icon = INSTRUMENT_ICONS[instrument as InstrumentType];

            return (
              <div key={instrument} className="flex items-center space-x-4">
                <div className="bg-secondary p-2 rounded-full">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium capitalize">
                    {instrument}
                  </div>
                  <div className="text-2xl font-bold">{count}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function MonthlyStatsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const currentMonth = format(new Date(), "yyyy-MM");
  const selectedMonth = searchParams.month || currentMonth;
  const stats = await getCombinedStats(selectedMonth);
  const monthDisplay = format(new Date(selectedMonth), "MMMM yyyy");

  return (
    <Suspense fallback={<MonthlyStatsLoading />}>
      {/* <Container width="marginxy" className="mx-10"> */}
        <AddStudentButton />

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Statistics Dashboard</h1>
          <MonthPicker defaultValue={selectedMonth} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {stats.hasData ? (
            <>
              <StatCard
                title="Active Students"
                value={stats.monthly.activeStudents}
                yearlyValue={stats.yearly.activeStudents}
                subtitle={`As of ${monthDisplay}`}
                icon={Users}
              />
              <StatCard
                title="Total Payments"
                value={stats.monthly.totalPayments}
                yearlyValue={stats.yearly.totalPayments}
                subtitle={`Collected in ${monthDisplay}`}
                icon={IndianRupee}
              />
              <InstrumentBreakdown
                monthly={stats.monthly.instrumentBreakdown}
              />
            </>
          ) : (
            <NoDataCard />
          )}
        </div>
      {/* </Container> */}
    </Suspense>
  );
}
