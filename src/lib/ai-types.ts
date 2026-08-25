export type QuizQuestion = {
  type: "mcq" | "truefalse" | "short" | "structured";
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  marks: number;
  subtopic: string;
};
export type QuizPayload = { questions: QuizQuestion[] };

export type ExamQuestion = {
  number: string;
  question: string;
  marks: number;
  modelAnswer: string;
  markingPoints: string[];
  keyTerms: string[];
  subtopic: string;
};
export type ExamPayload = { totalMarks: number; questions: ExamQuestion[] };

export type MarkResult = {
  number: string;
  awarded: number;
  outOf: number;
  feedback: string;
  missed: string[];
};
export type MarkPayload = {
  results: MarkResult[];
  total: number;
  outOf: number;
  percentage: number;
  strengths: string[];
  improvements: string[];
  nextStep: string;
};

export type PlanDay = {
  day: string;
  topic: string;
  activity: string;
  duration: string;
  revision: string;
  practice: string;
};
export type PlanPayload = {
  overview: string;
  weeks: { label: string; days: PlanDay[] }[];
  tips: string[];
};

export const GRADES = ["Grade 10", "Grade 11", "Grade 12"] as const;
export const TOPICS = [
  "Cell Biology",
  "Genetics",
  "Human Reproduction",
  "Evolution",
  "Ecology",
  "Plant Biology",
  "Human Biology",
  "Other",
] as const;
