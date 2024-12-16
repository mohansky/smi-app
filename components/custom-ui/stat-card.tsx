import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Heading } from "./heading";

export function StatCard({
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
    <div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-5"> 
          {title.includes("Payments") || title.includes("Expenses") ? "₹ " : ""}
          {value.toLocaleString()}
          <Heading
            size="xxxs"
            variant="cardtitle"
            className="text-muted-foreground"
          >
            {subtitle}
          </Heading>
        </div> 
        <Heading size="xxxs" className="border-t border-muted text-xs text-muted-foreground">
          <span>
            Yearly Total: {" "} 
            {title.includes("Payments") || title.includes("Expenses")
              ? "₹ "
              : ""}
            {yearlyValue.toLocaleString()}
          </span>
        </Heading> 
      </CardContent>
    </div>
  );
}
