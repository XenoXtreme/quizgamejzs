import Layout from "@/layout/prelimsLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prelims Quiz",
  description: "Participate in the prelims quiz competition.",
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
