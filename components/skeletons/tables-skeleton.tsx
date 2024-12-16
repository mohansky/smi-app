import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/custom-ui/container";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function TablesPageLoading() {
  return (
    <Container width="marginy">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-8 w-1/4" /> {/* Table Title */}
          <div className="flex space-x-4">
            {/* Filter Skeletons */}
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-48" />
          </div>
        </CardHeader>
        <CardContent>
          {/* Table Header Skeleton */}
          <div className="flex mb-4 space-x-4">
            {[1, 2, 3, 4, 5, 6].map((col) => (
              <Skeleton key={col} className="h-6 flex-1" />
            ))}
          </div>

          {/* Table Rows Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
              <div key={row} className="flex space-x-4 items-center">
                {[1, 2, 3, 4, 5, 6].map((col) => (
                  <Skeleton key={col} className="h-4 flex-1" />
                ))}
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-between items-center mt-6">
            <Skeleton className="h-8 w-32" /> {/* Page info */}
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-20" /> {/* Previous */}
              <Skeleton className="h-8 w-20" /> {/* Next */}
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}