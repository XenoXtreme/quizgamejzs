import { Metadata } from "next";
import { Panel } from "@/components/website/quiz/panel/question-panel/tie";

// METADATA
export const metadata: Metadata = {
  title: "Tie Breaker - Interschool",
  description: "Annual quiz competition of Jalpaiguri Zilla School",
};

export default function Page() {
  return (
    <div>
      <Panel />
    </div>
  );
}
