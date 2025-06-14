// CSS
import "./globals.css";

// FLOWBITE
import { ThemeModeScript } from "flowbite-react";

// METADATA
import type { Metadata } from "next";

// LAYOUT
import Layout from "@/layout/layout";

// FONTAWESOME
import { config } from "@fortawesome/fontawesome-svg-core";

// CSS
import "@fortawesome/fontawesome-svg-core/styles.css";

// CONFIG FONTAWESOME
config.autoAddCss = false;

// TOP LOADER
import NextTopLoader from 'nextjs-toploader';

// FONT
import { Nunito } from "next/font/google";

// METADATA
export const metadata: Metadata = {
  title: "Quizdom",
  description: "Annual quiz competition of Jalpaiguri Zilla School",
};

// NUNITO FONT
const nunito = Nunito({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body className={`${nunito.className} dark:bg-gray-900`}>
        <NextTopLoader />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
