import { Metadata } from "next";
import About from "@/components/website/static/about";

export const metadata : Metadata = {
  title: 'About - Quizdom',
  description: 'Learn more about the Quizdom application.',
};

export default function Page() {
    return (
      <div><About/></div>
      
    );
  }
  