import { Metadata } from 'next';
import Panel from '@/components/website/quiz/panel/question-panel/general/cc';

// METADATA
export const metadata: Metadata = {
    title: "Connections - Interschool",
    description: "Annual quiz competition of Jalpaiguri Zilla School",
  };

export default function Page() {
  return (
    <div><Panel category="interschool" /></div>
  )
}
