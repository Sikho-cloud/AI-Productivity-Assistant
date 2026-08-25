import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks, CheckCircle2, XCircle, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Markdown } from "@/components/Markdown";
import { AiLoading, ErrorNote, PageHeader, ResponsibleAiNote } from "@/components/ui/ai-bits";
import { generateQuiz } from "@/lib/ai.functions";
import { GRADES, TOPICS, type QuizQuestion } from "@/lib/ai-types";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/app/quiz")({
  head: () => ({
    meta: [
      { title: "Smart Quiz Generator | LifeSci Tutor AI" },
      {
        name: "description",
        content:
          "Generate CAPS-aligned Life Sciences quizzes by grade, topic and difficulty, answered one question at a time with instant marking.",
      },
      { property: "og:title", content: "Smart Quiz Generator | LifeSci Tutor AI" },
      {
        property: "og:description",
        content: "AI-generated Life Sciences quizzes with instant marking and teaching feedback.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizPage,
});

const DIFFICULTIES = ["Easy", "Medium", "Hard", "Exam Level"];
const TYPE_OPTIONS = [
  { id: "mcq", label: "Multiple choice" },
  { id: "truefalse", label: "True/False" },
  { id: "short", label: "Short answer" },
  { id: "structured", label: "Structured question" },
];

function normalise(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
}

function QuizPage() {
  const { state, update, logActivity } = useAppState();
  const [grade, setGrade] = useState(state.grade);
  const [topic, setTopic] = useState("Genetics");
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState(5);
  const [types, setTypes] = useState<string[]>(["mcq", "truefalse", "short"]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState<null | { correct: boolean }>(null);
  const [results, setResults] = useState<{ correct: boolean; subtopic: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = useServerFn(generateQuiz);

  const current = questions[index];
  const finished = questions.length > 0 && index >= questions.length;
  const score = results.filter((r) => r.correct).length;

  async function start() {
    if (!types.length) {
      toast.error("Select at least one question type.");
      return;
    }
    setError(null);
    setLoading(true);
    setQuestions([]);
    setResults([]);
    setIndex(0);
    setAnswer("");
    setChecked(null);
    try {
      const res = await run({ data: { grade, topic, difficulty, count, types } });
      if (!res.questions?.length) throw new Error("No questions were generated. Please try again.");
      setQuestions(res.questions);
      update({ grade });
      toast.success(`${res.questions.length} questions ready.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate the quiz.");
    } finally {
      setLoading(false);
    }
  }

  function check() {
    if (!current) return;
    if (!answer.trim()) {
      toast.error("Please answer before marking.");
      return;
    }
    const expected = normalise(current.answer);
    const given = normalise(answer);
    const correct =
      current.type === "mcq" || current.type === "truefalse"
        ? expected === given || expected.includes(given) || given.includes(expected)
        : expected
            .split(" ")
            .filter((w) => w.length > 4)
            .some((w) => given.includes(w));
    setChecked({ correct });
    setResults((r) => [...r, { correct, subtopic: current.subtopic }]);
  }

  function next() {
    setChecked(null);
    setAnswer("");
    const nextIndex = index + 1;
    setIndex(nextIndex);
    if (nextIndex >= questions.length) {
      const pct = Math.round(((score + (checked?.correct ? 0 : 0)) / questions.length) * 100);
      logActivity({
        kind: "quiz",
        title: `${topic} quiz (${difficulty})`,
        topic,
        grade,
        score: pct,
      });
    }
  }

  const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const weakSubtopics = [...new Set(results.filter((r) => !r.correct).map((r) => r.subtopic))];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Quiz Generator"
        subtitle="Generate a CAPS-aligned quiz and answer one question at a time with instant feedback."
        icon={ListChecks}
      />

      <div className="surface grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Grade">
          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GRADES.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Topic">
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TOPICS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Difficulty">
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Number of questions">
          <Input
            type="number"
            min={1}
            max={15}
            value={count}
            onChange={(e) => setCount(Math.min(15, Math.max(1, Number(e.target.value) || 1)))}
          />
        </Field>

        <div className="sm:col-span-2 lg:col-span-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Question types</p>
          <div className="flex flex-wrap gap-4">
            {TYPE_OPTIONS.map((t) => (
              <label key={t.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={types.includes(t.id)}
                  onCheckedChange={(v) =>
                    setTypes((prev) =>
                      v ? [...prev, t.id] : prev.filter((x) => x !== t.id),
                    )
                  }
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-4">
          <Button onClick={() => void start()} disabled={loading}>
            <Sparkles className="size-4" /> {questions.length ? "Generate new quiz" : "Generate quiz"}
          </Button>
        </div>
      </div>

      {loading && <AiLoading label="Writing your quiz questions…" />}
      {error && <ErrorNote message={error} />}

      {current && !finished && (
        <div className="surface space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              Question {index + 1} of {questions.length}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {current.subtopic} · {current.marks} mark{current.marks === 1 ? "" : "s"}
            </span>
          </div>
          <Progress value={(index / questions.length) * 100} className="h-1.5" />
          <p className="text-base font-medium">{current.question}</p>

          {current.options?.length ? (
            <div className="grid gap-2">
              {current.options.map((o) => (
                <button
                  key={o}
                  type="button"
                  disabled={!!checked}
                  onClick={() => setAnswer(o)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    answer === o
                      ? "border-primary bg-primary/10 text-foreground"
                      : "hover:bg-secondary/60"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          ) : (
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={!!checked}
              rows={4}
              placeholder="Type your answer…"
            />
          )}

          {checked ? (
            <div
              className={`rounded-2xl border p-4 ${
                checked.correct
                  ? "border-primary/30 bg-primary/5"
                  : "border-destructive/30 bg-destructive/5"
              }`}
            >
              <p className="flex items-center gap-2 font-medium">
                {checked.correct ? (
                  <>
                    <CheckCircle2 className="size-4 text-primary" /> Correct — well done!
                  </>
                ) : (
                  <>
                    <XCircle className="size-4 text-destructive" /> Not quite
                  </>
                )}
              </p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Correct answer: </span>
                {current.answer}
              </p>
              <div className="mt-1">
                <Markdown content={current.explanation} />
              </div>
              <Button className="mt-3" onClick={next}>
                {index + 1 === questions.length ? "See results" : "Next question"}
              </Button>
            </div>
          ) : (
            <Button onClick={check}>Mark my answer</Button>
          )}
        </div>
      )}

      {finished && (
        <div className="surface space-y-5 p-6">
          <h2 className="text-xl font-semibold">Quiz Results</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Score" value={`${score} / ${questions.length}`} />
            <Stat label="Percentage" value={`${percentage}%`} />
            <Stat label="Incorrect" value={`${questions.length - score}`} />
          </div>
          <Progress value={percentage} className="h-2" />
          <div>
            <p className="text-sm font-medium">Topics requiring revision</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {weakSubtopics.length ? weakSubtopics.join(", ") : "None — excellent work!"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Recommended next activity</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {percentage >= 75
                ? "You are ready for exam-level practice on this topic."
                : "Revisit the explanations with the AI Tutor, then retry this quiz at the same difficulty."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void start()} variant="outline">
              <RotateCcw className="size-4" /> Try another quiz
            </Button>
            <Button asChild>
              <Link to={percentage >= 75 ? "/app/exam" : "/app/tutor"}>
                {percentage >= 75 ? "Practise exam questions" : "Ask the AI Tutor"}
              </Link>
            </Button>
          </div>
        </div>
      )}

      <ResponsibleAiNote />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary/50 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
