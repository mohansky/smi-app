import type { Metadata } from "next";
import { Fira_Sans, Oxanium } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/layout/footer";
import Menu from "@/components/layout/menu";
import { options } from "#site/content";
import AuthProvider from "@/context/auth-provider";
import { Toaster } from "@/components/ui/sonner";
// import { GoogleTagManager } from '@next/third-parties/google'

const oxanium = Oxanium({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-oxanium",
  display: "swap",
});

const fira_sans = Fira_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-fira_sans",
  display: "swap",
});

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
      suppressHydrationWarning={true}
      className={`${oxanium.variable} ${fira_sans.variable}`}
    >
      {/* <GoogleTagManager gtmId="GTM-XYZ" /> */}
      <body>
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
