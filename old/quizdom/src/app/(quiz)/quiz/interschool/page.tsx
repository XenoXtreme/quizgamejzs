import { Metadata } from 'next';
import Panel from '@/components/website/quiz/panel/interschool';

// METADATA
export const metadata: Metadata = {
    title: "Interschool - Quizdom",
    description: "Annual quiz competition of Jalpaiguri Zilla School",
  };

export default function Page() {
  return (
    <div><Panel/></div>
  )
}
