import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MessageCircleQuestion,
  ListChecks,
  FileText,
  CalendarRange,
  NotebookPen,
  GraduationCap,
  TrendingUp,
  Library,
  Settings,
  ShieldCheck,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_GROUPS = [
  {
    label: "Learn",
    items: [
      { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { to: "/app/tutor", label: "AI Tutor", icon: MessageCircleQuestion },
      { to: "/app/quiz", label: "Quiz Generator", icon: ListChecks },
      { to: "/app/exam", label: "Exam Practice", icon: FileText },
      { to: "/app/planner", label: "Study Planner", icon: CalendarRange },
      { to: "/app/notes", label: "Notes Summarizer", icon: NotebookPen },
    ],
  },
  {
    label: "Tutor",
    items: [{ to: "/app/assistant", label: "Tutor Assistant", icon: GraduationCap }],
  },
  {
    label: "More",
    items: [
      { to: "/app/progress", label: "Progress", icon: TrendingUp },
      { to: "/app/resources", label: "Resources", icon: Library },
      { to: "/app/responsible-ai", label: "Responsible AI", icon: ShieldCheck },
      { to: "/app/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <Leaf className="size-4.5" />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-base font-semibold text-foreground">
            LifeSci Tutor AI
          </span>
          <span className="block text-[11px] text-muted-foreground">Learn smarter</span>
        </span>
      )}
    </Link>
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-6">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            {group.label}
          </p>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const active =
                "exact" in item && item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <item.icon className={cn("size-4.5", active && "text-primary")} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
