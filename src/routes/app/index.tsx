import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MessageCircleQuestion,
  ListChecks,
  FileText,
  CalendarRange,
  NotebookPen,
  GraduationCap,
  Flame,
  Trophy,
  BookOpenCheck,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ResponsibleAiNote } from "@/components/ui/ai-bits";
import { useAppState, topicStats } from "@/lib/store";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Learner Dashboard | LifeSci Tutor AI" },
      {
        name: "description",
        content:
          "Track your Life Sciences progress, continue recent topics and jump straight into AI tutoring, quizzes and exam practice.",
      },
      { property: "og:title", content: "Learner Dashboard | LifeSci Tutor AI" },
      {
        property: "og:description",
        content: "Your Life Sciences learning hub: progress, recent topics and quick AI actions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const QUICK = [
  { to: "/app/tutor", label: "Ask AI Tutor", icon: MessageCircleQuestion },
  { to: "/app/quiz", label: "Take a Quiz", icon: ListChecks },
  { to: "/app/exam", label: "Practise Exam Questions", icon: FileText },
  { to: "/app/planner", label: "Create Study Plan", icon: CalendarRange },
  { to: "/app/notes", label: "Summarize Notes", icon: NotebookPen },
  { to: "/app/assistant", label: "Tutor Assistant", icon: GraduationCap },
] as const;

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const { state } = useAppState();
  const stats = topicStats(state.activities);
  const scored = state.activities.filter((a) => typeof a.score === "number");
  const average = scored.length
    ? Math.round(scored.reduce((t, a) => t + (a.score ?? 0), 0) / scored.length)
    : 0;
  const completed = new Set(state.activities.map((a) => a.topic)).size;
  const weakest = [...stats].reverse().slice(0, 3);

  const cards = [
    { label: "Current Grade", value: state.grade, icon: BookOpenCheck, hint: "CAPS Life Sciences" },
    { label: "Topics Covered", value: `${completed}`, icon: Trophy, hint: "of 8 core topics" },
    { label: "Quiz Average", value: `${average}%`, icon: ListChecks, hint: `${scored.length} attempts` },
    { label: "Study Streak", value: `${state.streak} days`, icon: Flame, hint: "Keep it going!" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">
          {greeting()}, {state.name} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">What would you like to learn today?</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="surface p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{c.label}</p>
              <c.icon className="size-4 text-primary" />
            </div>
            <p className="mt-2 font-display text-2xl font-semibold">{c.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.hint}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK.map((q) => (
            <Button
              key={q.to}
              asChild
              variant="outline"
              className="h-auto justify-start gap-3 rounded-2xl px-4 py-4"
            >
              <Link to={q.to}>
                <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <q.icon className="size-4.5" />
                </span>
                <span className="font-medium">{q.label}</span>
                <ArrowRight className="ml-auto size-4 text-muted-foreground" />
              </Link>
            </Button>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-semibold">Continue Learning</h2>
          <div className="space-y-3">
            {state.activities.slice(0, 5).map((a) => (
              <div key={a.id} className="surface flex items-center gap-3 p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <Clock className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.topic} · {new Date(a.at).toLocaleDateString("en-ZA")}
                  </p>
                </div>
                {typeof a.score === "number" && (
                  <Badge variant="secondary" className="ml-auto">
                    {a.score}%
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Recommended for You</h2>
          <div className="surface p-5">
            <p className="text-sm text-muted-foreground">
              Based on your recent quiz and exam performance, focus your revision here:
            </p>
            <div className="mt-4 space-y-4">
              {weakest.length ? (
                weakest.map((t) => (
                  <div key={t.topic}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{t.topic}</span>
                      <span className="text-muted-foreground">{t.average}%</span>
                    </div>
                    <Progress value={t.average} className="mt-1.5 h-1.5" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Take a quiz to unlock personalised recommendations.
                </p>
              )}
            </div>
            <Button asChild size="sm" className="mt-5">
              <Link to="/app/quiz">Revise with a quiz</Link>
            </Button>
          </div>
        </div>
      </section>

      <ResponsibleAiNote />
    </div>
  );
}
