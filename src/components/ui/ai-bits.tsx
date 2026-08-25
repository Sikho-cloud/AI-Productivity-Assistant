import { Loader2, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </span>
        ) : null}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </div>
  );
}

export function AiLoading({ label = "The AI tutor is thinking…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-dashed bg-card/60 px-4 py-4 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin text-primary" />
      <span>{label}</span>
      <span className="ml-auto hidden items-center gap-1 text-xs text-primary sm:flex">
        <Sparkles className="size-3.5" /> AI
      </span>
    </div>
  );
}

export function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed bg-card/50 px-6 py-14 text-center">
      <span className="mb-3 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-foreground">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
      <span>{message}</span>
    </div>
  );
}

export function ResponsibleAiNote({
  variant = "learner",
  className,
}: {
  variant?: "learner" | "tutor";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border bg-secondary/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
      <span>
        {variant === "tutor"
          ? "Please review AI-generated questions and memoranda before giving them to learners."
          : "AI-generated explanations should be checked against official curriculum materials, teacher guidance and prescribed learning resources."}
      </span>
    </div>
  );
}
