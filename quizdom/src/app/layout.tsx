import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

// LAYOUT
import Layout from "@/layout/index";

// FONT
const nunito = Nunito({
  subsets: ["latin"],
});

// METADATA
export const metadata: Metadata = {
  title: "Quizdom",
  description: "Annual quiz competition of Jalpaiguri Zilla School",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.className} antialiased`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
