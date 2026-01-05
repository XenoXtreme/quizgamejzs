import { Metadata } from "next";
import Panel from "@/components/website/quiz/panel/question-panel/oyo";

// METADATA
export const metadata: Metadata = {
  title: "On Your Own - Interschool",
  description:
    "Annual quiz competition of Jalpaiguri Zilla School and other schools in Jalpaiguri district",
};

export default function Page() {
  return (
    <div>
      <Panel />
    </div>
  );
}
