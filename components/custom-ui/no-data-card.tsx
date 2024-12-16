import { Ban } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export function NoDataCard() {
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
