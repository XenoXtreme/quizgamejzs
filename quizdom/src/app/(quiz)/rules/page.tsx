import { Metadata } from "next";
import Rules from "@/components/website/static/rules";

export const metadata: Metadata = {
  title: "Rules - Quizdom",
  description: "Rules about the quiz.",
};

export default function Page() {
  return (
    <div>
      <Rules />
    </div>
  );
}
