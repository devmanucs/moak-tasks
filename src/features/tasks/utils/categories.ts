export const TASK_CATEGORIES = [
  {
    id: "pessoal",
    label: "Pessoal",
    badgeBg: "bg-sky-500/15",
    badgeText: "text-sky-400",
  },
  {
    id: "trabalho",
    label: "Trabalho",
    badgeBg: "bg-violet-500/15",
    badgeText: "text-violet-400",
  },
  {
    id: "academia",
    label: "Academia",
    badgeBg: "bg-emerald-500/15",
    badgeText: "text-emerald-400",
  },
  {
    id: "estudos",
    label: "Estudos",
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-400",
  },
  {
    id: "outro",
    label: "Outro",
    badgeBg: "bg-muted",
    badgeText: "text-muted-foreground",
  },
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number]["id"];

export const DEFAULT_TASK_CATEGORY: TaskCategory = "pessoal";

export function getCategoryMeta(category?: TaskCategory) {
  return (
    TASK_CATEGORIES.find((c) => c.id === category) ??
    TASK_CATEGORIES.find((c) => c.id === "outro")!
  );
}
