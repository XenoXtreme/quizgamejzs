import Login from "@/components/website/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Quizdom",
  description: "Login to access your Quizdom account and start playing.",
};

export default function Page() {
  return (
    <div><Login /></div>

  );
}