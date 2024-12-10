import {
  User,
  IndianRupee,
  CalendarDays,
  Calendar1,
  LayoutDashboard,
  Home,
  // Inbox, Search, Settings
} from "lucide-react";
export const menu: {
  text: string;
  url: string;
  id?: number;
  icon: string | React.ComponentType;
}[] = [
  {
    text: "Home",
    url: "/",
    id: 1,
    icon: Home,
  },
  {
    text: "Dashboard",
    url: "/dashboard",
    id: 2,
    icon: LayoutDashboard,
  },
  {
    text: "Students",
    url: "/dashboard/students",
    id: 3,
    icon: User,
  },
  {
    text: "Attendance",
    url: "/dashboard/attendance",
    id: 4,
    icon: Calendar1,
  },
  {
    text: "Payments",
    url: "/dashboard/payments",
    id: 5,
    icon: IndianRupee,
  },
  {
    text: "Schedule",
    url: "/dashboard/schedule",
    id: 6,
    icon: CalendarDays,
  },
];
