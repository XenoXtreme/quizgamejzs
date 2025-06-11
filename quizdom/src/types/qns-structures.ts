// Question structure type
export interface QuestionItem {
  q_no: string;
  display_text: string;
}

// Section type: a mapping from section key to array of questions
export type Section = Record<string, QuestionItem[]>;

// INTERSCHOOL STRUCTURE
export const InterSch: Section = {
  pbk: [
    { q_no: "1", display_text: "Question - I" },
    { q_no: "2", display_text: "Question - II" },
    { q_no: "3", display_text: "Question - III" },
    { q_no: "4", display_text: "Question - IV" },
    { q_no: "5", display_text: "Question - V" },
    { q_no: "6", display_text: "Question - VI" },
    { q_no: "7", display_text: "Question - VII" },
    { q_no: "8", display_text: "Question - VIII" },
    { q_no: "9", display_text: "Question - IX" },
    { q_no: "10", display_text: "Question - X" },
  ],
};

// GENERAL STRUCTURE
export const General: Section = {
  oyo: [
    { q_no: "1", display_text: "Question - I" },
    { q_no: "2", display_text: "Question - II" },
    { q_no: "3", display_text: "Question - III" },
    { q_no: "4", display_text: "Question - IV" },
    { q_no: "5", display_text: "Question - V" },
    { q_no: "6", display_text: "Question - VI" },
  ],
  mm: [
    { q_no: "1", display_text: "Question - I" },
    { q_no: "2", display_text: "Question - II" },
    { q_no: "3", display_text: "Question - III" },
    { q_no: "4", display_text: "Question - IV" },
    { q_no: "5", display_text: "Question - V" },
    { q_no: "6", display_text: "Question - VI" },
  ],
  oyf: [
    { q_no: "literature", display_text: "Literature" },
    { q_no: "history", display_text: "History" },
    { q_no: "music", display_text: "Music" },
    { q_no: "sports", display_text: "Sports" },
    { q_no: "science", display_text: "Science" },
    { q_no: "mystery", display_text: "Mytery Box" },
  ],
  cc: [
    { q_no: "1", display_text: "Question - I" },
    { q_no: "2", display_text: "Question - II" },
    { q_no: "3", display_text: "Question - III" },
    { q_no: "4", display_text: "Question - IV" },
    { q_no: "5", display_text: "Question - V" },
    { q_no: "answer", display_text: "Connection" },
  ],
  pnb: [
    { q_no: "1", display_text: "Question - I" },
    { q_no: "2", display_text: "Question - II" },
    { q_no: "3", display_text: "Question - III" },
    { q_no: "4", display_text: "Question - IV" },
    { q_no: "5", display_text: "Question - V" },
    { q_no: "6", display_text: "Question - VI" },
  ],
};
