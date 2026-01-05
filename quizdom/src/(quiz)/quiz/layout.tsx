import Layout from "@/layout/quizLayout";
import type { Metadata } from "next";
// METADATA
export const metadata: Metadata = {
  title: "Quiz Panel - Quizdom",
  description: "Annual quiz competition of Jalpaiguri Zilla School",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Layout>{children}</Layout>
    </div>
  );
}
