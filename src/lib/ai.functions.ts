import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  TUTOR_SYSTEM_PROMPT,
  QUIZ_SYSTEM,
  EXAM_SYSTEM,
  MARK_SYSTEM,
  NOTES_SYSTEM,
  FLASHCARD_SYSTEM,
  PLAN_SYSTEM,
  TUTOR_ASSISTANT_SYSTEM,
  askText,
  askJson,
  tutorChatPrompt,
  quizPrompt,
  examPrompt,
  markPrompt,
} from "./ai-engine.server";
import type { QuizPayload, ExamPayload, MarkPayload, PlanPayload } from "./ai-types";

export const tutorChat = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        grade: z.string(),
        topic: z.string(),
        message: z.string().min(1),
        notes: z.string().optional(),
        history: z
          .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
          .optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const history = (data.history ?? [])
      .slice(-6)
      .map((m) => `${m.role === "user" ? "Learner" : "Tutor"}: ${m.content}`)
      .join("\n\n");
    const prompt =
      (history ? `PREVIOUS CONVERSATION\n${history}\n\n` : "") +
      tutorChatPrompt(data.grade, data.topic, data.message, data.notes);
    return { text: await askText(TUTOR_SYSTEM_PROMPT, prompt) };
  });

export const generateQuiz = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        grade: z.string(),
        topic: z.string(),
        difficulty: z.string(),
        count: z.number().min(1).max(15),
        types: z.array(z.string()).min(1),
      })
      .parse(d),
  )
  .handler(async ({ data }) => askJson<QuizPayload>(QUIZ_SYSTEM, quizPrompt(data)));

export const generateExam = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        grade: z.string(),
        topic: z.string(),
        count: z.number().min(1).max(10),
        difficulty: z.string(),
        marks: z.number().min(5).max(100),
      })
      .parse(d),
  )
  .handler(async ({ data }) => askJson<ExamPayload>(EXAM_SYSTEM, examPrompt(data)));

export const markAnswers = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ payload: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => askJson<MarkPayload>(MARK_SYSTEM, markPrompt(data.payload)));

export const summariseNotes = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ notes: z.string().min(20), mode: z.string(), grade: z.string() }).parse(d),
  )
  .handler(async ({ data }) => ({
    text: await askText(
      NOTES_SYSTEM,
      `INPUT\nGrade: ${data.grade}\nRequested output: ${data.mode}\nNotes:\n"""${data.notes.slice(0, 12000)}"""`,
    ),
  }));

export const makeFlashcards = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ notes: z.string().min(20) }).parse(d))
  .handler(async ({ data }) =>
    askJson<{ cards: { front: string; back: string }[] }>(
      FLASHCARD_SYSTEM,
      `INPUT\nNotes:\n"""${data.notes.slice(0, 12000)}"""`,
    ),
  );

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        grade: z.string(),
        examDate: z.string(),
        topics: z.string(),
        strongest: z.string(),
        weakest: z.string(),
        hours: z.string(),
        days: z.array(z.string()),
      })
      .parse(d),
  )
  .handler(async ({ data }) =>
    askJson<PlanPayload>(
      PLAN_SYSTEM,
      `INPUT
Grade: ${data.grade}
Examination date: ${data.examDate}
Topics to study: ${data.topics}
Strongest topics: ${data.strongest}
Weakest topics: ${data.weakest}
Hours available per day: ${data.hours}
Preferred study days: ${data.days.join(", ")}

INSTRUCTIONS
Create up to 4 weeks of plan, only on the preferred study days.`,
    ),
  );

export const tutorAssistant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ tool: z.string(), input: z.string() }).parse(d))
  .handler(async ({ data }) => ({
    text: await askText(
      TUTOR_ASSISTANT_SYSTEM,
      `OBJECTIVE\nProduce: ${data.tool}\n\nINPUT\n${data.input}\n\nOUTPUT FORMAT\nWell-structured markdown, ready to print for a class.`,
    ),
  }));
