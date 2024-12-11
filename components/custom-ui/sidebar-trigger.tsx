"use client";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ViewVerticalIcon } from "@radix-ui/react-icons";

export function SidebarTrigger({
  className,
  ...props
}: {
  className?: string;
}) {
  const { toggleSidebar } = useSidebar();

  function handleToggle() {
    try {
      toggleSidebar();
    } catch (error) {
      console.error("Error toggling sidebar:", error);
    }
  }

  return (
    <Button
      aria-label="Open Sidebar"
      // onClick={toggleSidebar}
      onClick={handleToggle}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("fixed left-2 top-20 h-7 w-7 z-20", className)}
      {...props}
    >
      <ViewVerticalIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
