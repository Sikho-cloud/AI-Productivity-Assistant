import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MessageCircleQuestion,
  ListChecks,
  FileText,
  CalendarRange,
  NotebookPen,
  GraduationCap,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Sparkles,
  Leaf,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-lifesci.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LifeSci Tutor AI | AI Life Sciences tutor for Grade 10-12" },
      {
        name: "description",
        content:
          "AI-powered Life Sciences tutoring for South African Grade 10-12 learners: explanations, quizzes, exam practice, study plans and tutor tools.",
      },
      { property: "og:title", content: "LifeSci Tutor AI | Your personal AI Life Sciences tutor" },
      {
        property: "og:description",
        content:
          "Understand difficult concepts, practise exam questions and build a smarter study plan with AI-powered learning support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: MessageCircleQuestion,
    title: "AI Life Sciences Tutor",
    text: "Ask any Grade 10-12 question and get a step-by-step explanation, key terms and a check question.",
  },
  {
    icon: ListChecks,
    title: "Smart Quizzes",
    text: "Generate quizzes by grade, topic and difficulty. Marked instantly with teaching feedback.",
  },
  {
    icon: FileText,
    title: "Exam Practice",
    text: "Realistic NSC-style questions with mark allocations, marking and a full memorandum.",
  },
  {
    icon: CalendarRange,
    title: "Study Planner",
    text: "A realistic weekly plan built around your exam date, weak topics and available hours.",
  },
  {
    icon: NotebookPen,
    title: "Notes Summarizer",
    text: "Turn long notes into summaries, key terms, flashcards and possible exam questions.",
  },
  {
    icon: GraduationCap,
    title: "Tutor Assistant",
    text: "Lesson plans, worksheets, assessments, memoranda and learner feedback in minutes.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Leaf className="size-4.5" />
            </span>
            <span className="font-display text-base font-semibold">LifeSci Tutor AI</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/app/assistant">I'm a Tutor</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/app">Start Learning</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="hero-gradient">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
              <Sparkles className="size-3.5 text-primary" />
              Built for CAPS Life Sciences · Mthatha, South Africa
            </span>
            <h1 className="mt-5 text-4xl leading-[1.08] font-semibold text-foreground sm:text-5xl lg:text-6xl">
              Your personal <span className="text-gradient-brand">AI Life Sciences</span> tutor
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Understand difficult concepts, practise exam questions and build a smarter study plan
              with AI-powered learning support.
            </p>
            <p className="mt-3 font-display text-sm text-primary">
              Learn smarter. Understand deeper. Achieve more.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/app">
                  Start Learning <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/app/assistant">I'm a Tutor</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["Grade 10-12", "CAPS aligned", "Instant marking"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-primary" /> {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="surface overflow-hidden p-2 shadow-lift">
              <img
                src={heroImage}
                alt="Illustration of the LifeSci Tutor AI dashboard with DNA, a plant and a microscope"
                width={1280}
                height={960}
                className="w-full rounded-xl"
              />
            </div>
            <div className="surface absolute -bottom-6 left-4 hidden max-w-56 p-4 sm:block">
              <p className="text-xs font-medium text-muted-foreground">Quiz average</p>
              <p className="font-display text-2xl font-semibold text-foreground">78%</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                <div className="h-1.5 w-[78%] rounded-full bg-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="text-center text-3xl font-semibold">Everything you need to master Life Sciences</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
          Six AI tools that support learners in class, at home and in the exam room — and save
          tutors hours of preparation.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="surface p-6 transition-shadow hover:shadow-lift">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              <MapPin className="size-4" /> Designed for South African learners
            </span>
            <h2 className="mt-3 text-3xl font-semibold">Built around Grade 10-12 Life Sciences</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              LifeSci Tutor AI is designed around the way Life Sciences is taught and assessed in
              South African schools. Explanations, quizzes and examination questions use CAPS
              terminology, South African English and NSC-style command words such as{" "}
              <em>name, state, describe, explain, compare</em> and <em>tabulate</em>.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              You can also paste your own class notes, textbook extracts or curriculum material.
              The AI will prioritise your material so that revision matches exactly what your
              teacher covered in class.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { k: "Grades supported", v: "10 · 11 · 12" },
              { k: "Core topics", v: "8 CAPS strands" },
              { k: "Tutor prep saved", v: "~4 hrs / week" },
              { k: "Marking", v: "Instant, with feedback" },
            ].map((s) => (
              <div key={s.k} className="surface p-5">
                <p className="text-xs text-muted-foreground">{s.k}</p>
                <p className="mt-1 font-display text-xl font-semibold">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="surface flex flex-col gap-4 p-7 sm:flex-row">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <h2 className="text-xl font-semibold">Responsible AI</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              AI-generated explanations should be checked against official curriculum materials,
              teacher guidance and prescribed learning resources. LifeSci Tutor AI is designed to
              support teaching and learning — not to replace your teacher, and not to help anyone
              cheat in an assessment.
            </p>
            <Link
              to="/app/responsible-ai"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Read our Responsible AI commitments <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} LifeSci Tutor AI · Mthatha, Eastern Cape</p>
          <p>Learn smarter. Understand deeper. Achieve more.</p>
        </div>
      </footer>
    </div>
  );
}
