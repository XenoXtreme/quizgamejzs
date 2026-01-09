import BuzzerPage from "@/components/website/quiz/buzzer";
import type { Metadata } from "next";
// METADATA
export const metadata: Metadata = {
  title: "Quiz Buzzer",
  description: "Participate in the quiz by buzzing in your answers.",
};

export default function Page() {
  return <BuzzerPage />;
}
