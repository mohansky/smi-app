import { 
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom-ui/app-sidebar"; 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>{children}</main>
      </SidebarProvider>
    </>
  );
}
