"use client";
import React from "react";

// ROUTER
import { redirect } from "next/navigation";

// USER
import { useAuthContext } from "@/context/auth/state";

// TOAST
import { toast } from "sonner";

export default function QuizLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const { team } = useAuthContext();
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            if (team.role && team.role !== "ADMIN") {
                toast.warning("You are not an admin.", {duration: 1000});
                redirect("/account");
            }
        }
    });
    return <div>{children}</div>;
}

