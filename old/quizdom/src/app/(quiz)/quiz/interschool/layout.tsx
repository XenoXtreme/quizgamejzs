import Layout from "@/layout/qnaLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interschool Quiz",
  description: "Participate in the interschool quiz competition.",
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
