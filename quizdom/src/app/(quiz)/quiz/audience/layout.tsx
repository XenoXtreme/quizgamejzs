import Layout from "@/layout/qnaLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Questions for Audience Engagement",
  description: "Participate in the quiz competition.",
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
