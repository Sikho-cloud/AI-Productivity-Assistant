import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircleQuestion, Send, Sparkles, User, Leaf, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Markdown } from "@/components/Markdown";
import { AiLoading, ErrorNote, PageHeader, ResponsibleAiNote } from "@/components/ui/ai-bits";
import { tutorChat } from "@/lib/ai.functions";
import { GRADES, TOPICS } from "@/lib/ai-types";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/app/tutor")({
  head: () => ({
    meta: [
      { title: "AI Life Sciences Tutor | LifeSci Tutor AI" },
      {
        name: "description",
        content:
          "Ask the AI Life Sciences tutor any Grade 10-12 question and get step-by-step explanations, key terms, examples and a check question.",
      },
      { property: "og:title", content: "AI Life Sciences Tutor | LifeSci Tutor AI" },
      {
        property: "og:description",
        content: "Step-by-step Life Sciences tutoring for South African Grade 10-12 learners.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TutorPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const QUICK_PROMPTS = [
  "Explain simpler",
  "Give me an example",
  "Test me",
  "Show key terms",
  "Explain step-by-step",
];

const DEMO =
  "Explain the menstrual cycle in a way that will help me answer a Grade 12 exam question. Include the important terminology, the sequence of events, likely examination points and then give me a sample exam question to answer.";

function TutorPage() {
  const { state, update, logActivity } = useAppState();
  const [grade, setGrade] = useState(state.grade);
  const [topic, setTopic] = useState("Human Reproduction");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ask = useServerFn(tutorChat);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => setGrade(state.grade), [state.grade]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const message = text.trim();
    if (!message) {
      toast.error("Please type a question first.");
      return;
    }
    setError(null);
    setInput("");
    const history = messages.slice(-6);
    setMessages((m) => [...m, { role: "user", content: message }]);
    setLoading(true);
    try {
      const res = await ask({ data: { grade, topic, message, history } });
      setMessages((m) => [...m, { role: "assistant", content: res.text }]);
      update({ grade });
      logActivity({ kind: "tutor", title: message.slice(0, 60), topic, grade });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="AI Life Sciences Tutor"
        subtitle="Ask anything — the tutor explains, gives examples and checks your understanding."
        icon={MessageCircleQuestion}
      />

      <div className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Grade</label>
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
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Topic</label>
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
        </div>
      </div>

      <div className="surface min-h-[22rem] space-y-4 p-4 sm:p-6">
        {messages.length === 0 && !loading ? (
          <div className="py-8 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </span>
            <p className="mt-3 font-medium">Start a tutoring session</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Try: “Explain photosynthesis to me.” Or run the Grade 12 demonstration below.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => void send(DEMO)}>
              <Wand2 className="size-4" /> Run demo: Grade 12 menstrual cycle
            </Button>
          </div>
        ) : null}

        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "flex justify-end gap-3" : "flex items-start gap-3"}
          >
            {m.role === "assistant" && (
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Leaf className="size-4" />
              </span>
            )}
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                  : "max-w-full flex-1 rounded-2xl bg-secondary/50 px-4 py-3"
              }
            >
              {m.role === "user" ? m.content : <Markdown content={m.content} />}
            </div>
            {m.role === "user" && (
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground">
                <User className="size-4" />
              </span>
            )}
          </div>
        ))}
        {loading && <AiLoading />}
        {error && <ErrorNote message={error} />}
        <div ref={endRef} />
      </div>

      {messages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((p) => (
            <Button
              key={p}
              size="sm"
              variant="secondary"
              disabled={loading}
              onClick={() => void send(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      )}

      <div className="surface flex items-end gap-2 p-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send(input);
            }
          }}
          placeholder="Ask your Life Sciences question…"
          rows={2}
          className="resize-none border-0 shadow-none focus-visible:ring-0"
        />
        <Button
          onClick={() => void send(input)}
          disabled={loading}
          size="icon"
          aria-label="Send question"
        >
          <Send className="size-4" />
        </Button>
      </div>

      <ResponsibleAiNote />
    </div>
  );
}
