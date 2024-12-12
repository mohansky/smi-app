import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom-ui/app-sidebar";
import { Container } from "@/components/custom-ui/container";
import { SidebarTrigger } from "@/components/custom-ui/sidebar-trigger";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Container width="marginy" animate={false} className="w-[98vw] md:w-[75vw] mb-10">
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
          <main>{children}</main>
        </SidebarProvider>
      </Container>
    </>
  );
}
