import { GymCheckin, Task } from "@/src/lib/storage";
import { getTasksForToday } from "@/src/features/tasks/utils/constants";

export interface DashboardStats {
  todayTotal: number;
  todayCompleted: number;
  todayPending: number;
  todayProgress: number;
  weekCheckins: number;
  totalTasks: number;
  streak: number;
}

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekCheckins(checkins: GymCheckin[]): number {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  return checkins.filter((c) => c.timestamp >= weekAgo.getTime()).length;
}

export function getCompletionStreak(tasks: Task[]): number {
  const completedByDay = new Map<string, boolean>();

  tasks.forEach((task) => {
    if (!task.completed) return;
    const day = startOfDay(new Date(task.createdAt)).toDateString();
    completedByDay.set(day, true);
  });

  let streak = 0;
  const cursor = startOfDay(new Date());

  while (completedByDay.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function getDashboardStats(
  tasks: Task[],
  checkins: GymCheckin[],
): DashboardStats {
  const todayTasks = getTasksForToday(tasks);
  const todayCompleted = todayTasks.filter((t) => t.completed).length;
  const todayTotal = todayTasks.length;
  const todayPending = todayTotal - todayCompleted;
  const todayProgress =
    todayTotal === 0 ? 0 : (todayCompleted / todayTotal) * 100;

  return {
    todayTotal,
    todayCompleted,
    todayPending,
    todayProgress,
    weekCheckins: getWeekCheckins(checkins),
    totalTasks: tasks.length,
    streak: getCompletionStreak(tasks),
  };
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function formatShortDate(date = new Date()) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function getRecentActivity(
  tasks: Task[],
  checkins: GymCheckin[],
): { id: string; label: string; time: string; type: "task" | "gym" }[] {
  const items: { id: string; label: string; time: number; type: "task" | "gym" }[] =
    [];

  tasks
    .filter((t) => t.completed)
    .forEach((t) => {
      items.push({
        id: `task-${t.id}`,
        label: `Concluiu "${t.title}"`,
        time: t.createdAt,
        type: "task",
      });
    });

  checkins.forEach((c) => {
    items.push({
      id: `gym-${c.id}`,
      label: "Check-in na academia",
      time: c.timestamp,
      type: "gym",
    });
  });

  return items
    .sort((a, b) => b.time - a.time)
    .slice(0, 5)
    .map((item) => ({
      ...item,
      time: new Date(item.time).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
}

export function hasCheckedInToday(checkins: GymCheckin[]): boolean {
  const today = new Date();
  return checkins.some((c) => isSameDay(new Date(c.timestamp), today));
}
