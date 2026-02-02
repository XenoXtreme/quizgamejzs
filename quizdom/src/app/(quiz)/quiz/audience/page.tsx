import { Metadata } from "next";
import Panel from "@/components/website/quiz/panel/audience";

// METADATA
export const metadata: Metadata = {
  title: "Audience Engagement - Quizdom",
  description: "Interactive audience engagement quiz for Quizdom",
};

export default function Page() {
  return (
    <div>
      <Panel />
    </div>
  );
}
