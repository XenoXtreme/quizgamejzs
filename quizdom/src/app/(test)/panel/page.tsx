"use client";
import { usePathname } from "next/navigation";
import QuizP from "@/components/panel/quiz/components/qp";

export default function Page() {
  const path = usePathname();

  return (
    <div>
      <QuizP
        qno="1"
        round="test"
        type="audio"
        quizCategory="interschool"
        key={"test"}
        limit="10"
        path={path}
      />
    </div>
  );
}
