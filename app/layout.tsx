import "./globals.css";
import type { Metadata } from "next"; 
import { ThemeProvider } from "next-themes";
import { options } from "#site/content";
import { oxanium, firaSans } from "@/app/local-fonts";
import { Toaster } from "@/components/ui/sonner";
import Menu from "@/components/layout/menu";
import Footer from "@/components/layout/footer";
import AuthProvider from "@/context/auth-provider";


export const metadata: Metadata = {
  title: `${options.title}`,
  description: `${options.description}`,
  metadataBase: new URL(`${options.basepath}`),
  generator: "Next.js",
  applicationName: `${options.name}`,
  referrer: "origin-when-cross-origin",
  keywords: [`${options.keywords}`],
  authors: [{ name: `${options.author.name}`, url: `${options.author.url}` }],
  creator: `${options.author.name}`,
  publisher: `${options.author.name}`,
  openGraph: {
    title: `${options.title}`,
    description: `${options.description}`,
    url: `${options.basepath}`,
    siteName: `${options.name}`,
    images: [
      {
        url: "https://sridharmusicalinstitute.com/images/smilogo.png",
        width: 720,
        height: 230,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: `${options.basepath}`,
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${oxanium.variable} ${firaSans.variable}`}
    >
      {/* <GoogleTagManager gtmId="GTM-XYZ" /> */}
      <body
        suppressHydrationWarning
        data-new-gr-c-s-check-loaded={undefined}
        data-gr-ext-installed={undefined} 
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Menu />
            {children}
            <Footer />
          </ThemeProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
