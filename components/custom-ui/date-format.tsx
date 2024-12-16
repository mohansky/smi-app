import { parseISO, format } from "date-fns";

interface DateFormatterProps {
  dateString: string | Date;
}

export default function DateFormatter({ dateString }: DateFormatterProps) {
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  const isoString = typeof dateString === 'string' ? dateString : dateString.toISOString();
  
  return <time dateTime={isoString}>{format(date, "d LLL yyyy")}</time>;
}