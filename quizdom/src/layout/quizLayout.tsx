"use client";
import React from "react";

// ROUTER
import { redirect } from "next/navigation";

// TOAST
import { toast } from "sonner";

export default function QuizLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("_user")) {
        toast.info("Please login to your team.", {duration: 2000});
        redirect("/login");
      }
    }
  });
  return <div>{children}</div>;
}
