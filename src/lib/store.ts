import { useCallback, useEffect, useState } from "react";

export type Activity = {
  id: string;
  kind: "tutor" | "quiz" | "exam" | "notes" | "plan";
  title: string;
  topic: string;
  grade: string;
  score?: number;
  at: number;
};

export type AppState = {
  grade: string;
  name: string;
  activities: Activity[];
  streak: number;
  planTasks: Record<string, boolean>;
};

const KEY = "lifesci-tutor-ai-state";

const seedActivities: Activity[] = [
  {
    id: "s1",
    kind: "quiz",
    title: "Genetics quiz",
    topic: "Genetics",
    grade: "Grade 12",
    score: 78,
    at: Date.now() - 86400000,
  },
  {
    id: "s2",
    kind: "tutor",
    title: "Meiosis explained",
    topic: "Cell Biology",
    grade: "Grade 12",
    at: Date.now() - 2 * 86400000,
  },
  {
    id: "s3",
    kind: "exam",
    title: "Human Reproduction exam practice",
    topic: "Human Reproduction",
    grade: "Grade 12",
    score: 64,
    at: Date.now() - 3 * 86400000,
  },
  {
    id: "s4",
    kind: "quiz",
    title: "Ecology quiz",
    topic: "Ecology",
    grade: "Grade 12",
    score: 52,
    at: Date.now() - 5 * 86400000,
  },
  {
    id: "s5",
    kind: "notes",
    title: "Photosynthesis notes summarised",
    topic: "Plant Biology",
    grade: "Grade 12",
    at: Date.now() - 6 * 86400000,
  },
];

export const defaultState: AppState = {
  grade: "Grade 12",
  name: "Learner",
  activities: seedActivities,
  streak: 5,
  planTasks: {},
};

function read(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...(JSON.parse(raw) as Partial<AppState>) };
  } catch {
    return defaultState;
  }
}

const listeners = new Set<(s: AppState) => void>();
let current: AppState | null = null;

export function useAppState() {
  const [state, setState] = useState<AppState>(defaultState);

  useEffect(() => {
    if (!current) current = read();
    setState(current);
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const update = useCallback((patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => {
    const base = current ?? read();
    const next = { ...base, ...(typeof patch === "function" ? patch(base) : patch) };
    current = next;
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
    listeners.forEach((l) => l(next));
  }, []);

  const logActivity = useCallback(
    (a: Omit<Activity, "id" | "at">) => {
      update((s) => ({
        activities: [{ ...a, id: crypto.randomUUID(), at: Date.now() }, ...s.activities].slice(
          0,
          40,
        ),
      }));
    },
    [update],
  );

  return { state, update, logActivity };
}

export function topicStats(activities: Activity[]) {
  const map = new Map<string, { total: number; count: number }>();
  activities
    .filter((a) => typeof a.score === "number")
    .forEach((a) => {
      const e = map.get(a.topic) ?? { total: 0, count: 0 };
      e.total += a.score!;
      e.count += 1;
      map.set(a.topic, e);
    });
  return [...map.entries()]
    .map(([topic, v]) => ({ topic, average: Math.round(v.total / v.count), attempts: v.count }))
    .sort((a, b) => b.average - a.average);
}
