import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Container } from "@/components/custom-ui/container";

export default function MonthlyStatsLoading() {
  return (
    <Container width="marginxy" className="mx-10">
      <Skeleton className="h-10 w-40 mb-8" /> {/* Add Student Button Skeleton */}

      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-4" /> {/* Page Title Skeleton */}
        <Skeleton className="h-10 w-full" /> {/* Month Picker Skeleton */}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Active Students Card Skeleton */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
          </CardContent>
        </Card>

        {/* Total Payments Card Skeleton */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
          </CardContent>
        </Card>

        {/* Instrument Breakdown Card Skeleton */}
        <Card className="col-span-full">
          <CardHeader>
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}