"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronUp, User2 } from "lucide-react";
import { SignOutButton } from "../buttons/sign-out-button";
import { adminMenu, userMenu } from "@/data/sidebar-menu";
import { UserProfile } from "./user-profile";
// import { Skeleton } from "../ui/skeleton";

interface Item {
  icon: React.ComponentType | string;
}

function SidebarIcon({ item }: { item: Item }) {
  const IconComponent = item.icon;
  return <IconComponent />;
}

export function AppSidebar() {
  const { data: session, status } = useSession();

  // if (status === "loading") {
  //   return <Skeleton className="h-[70vh] w-72 md:w-64" />;
  // }

  if (status === "unauthenticated") {
    return <div>Please log in.</div>;
  }

  const menu = session?.user?.role === "ADMIN" ? adminMenu : userMenu;

  return (
    <div className="h-[80vh] my-auto">
      <Sidebar
        variant="floating"
        collapsible="offcanvas"
        className="w-[--sidebar-width] h-[70vh] my-auto"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              {session?.user?.role === "ADMIN" ? "Admin" : "User"} Dashboard
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menu.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <SidebarIcon item={item} />
                        <span>{item.text}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {session?.user?.name || session?.user?.email}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width] space-y-2"
                >
                  <DropdownMenuItem>
                    <UserProfile />
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <SignOutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
