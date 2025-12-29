import Layout from "@/layout/quizLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Page - Quizdom",
  description: "Manage your account settings and preferences.",
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
