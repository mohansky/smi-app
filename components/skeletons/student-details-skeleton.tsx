import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/custom-ui/container";

export default function StudentDetailsLoading() {
  return (
    <Container width="marginxy" className="mx-5">
      <div className="grid md:grid-cols-9 gap-4 mb-10">
        {/* Student Details Column */}
        <div className="col-span-4">
          <Card className="p-6">
            <div className="space-y-4">
              {/* Profile Picture and Basic Info */}
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="space-y-1">
                    <Skeleton className="h-3 w-1/2 mb-1" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Attendance Column */}
        <Card className="p-4 col-span-5">
          <div className="mb-4">
            <Skeleton className="h-10 w-40" /> {/* Mark Attendance Button */}
          </div>
          
          {/* Attendance Table Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/4" /> {/* Table Title */}
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="flex space-x-4">
                  {[1, 2, 3, 4].map((col) => (
                    <Skeleton key={col} className="h-4 flex-1" />
                  ))}
                </div>
              ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-end space-x-2 mt-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </Card>
      </div>

      {/* Payments Card */}
      <Card className="p-4">
        <div className="mb-4">
          <Skeleton className="h-10 w-40" /> {/* Add Payment Button */}
        </div>
        
        {/* Payments Table Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/4" /> {/* Table Title */}
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="flex space-x-4">
                {[1, 2, 3, 4].map((col) => (
                  <Skeleton key={col} className="h-4 flex-1" />
                ))}
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-end space-x-2 mt-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </Card>
    </Container>
  );
}