"use client";
import { useState } from "react";
import { format, subMonths } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";

interface MonthPickerProps {
  defaultValue: string;
}

export function MonthPicker({ defaultValue }: MonthPickerProps) {
  const router = useRouter();
  const [month, setMonth] = useState(defaultValue);

  // Generate last 12 months for the dropdown
  const getLastTwelveMonths = () => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const date = subMonths(today, i);
      months.push(format(date, "yyyy-MM"));
    }
    return months;
  };

  const handleMonthChange = (newMonth: string) => {
    setMonth(newMonth);
    router.push(`/dashboard/admin/?month=${newMonth}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <CalendarIcon className="h-4 w-4" />
      <Select value={month} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {getLastTwelveMonths().map((monthOption) => (
            <SelectItem key={monthOption} value={monthOption}>
              {format(new Date(monthOption), "MMMM yyyy")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
