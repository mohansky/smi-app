import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom-ui/app-sidebar";
import { Container } from "@/components/custom-ui/container";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Container width="marginy" animate={false}>
        <SidebarProvider>
          <AppSidebar />

          <main>{children}</main>
        </SidebarProvider>
      </Container>
    </>
  );
}
