import { getTasksForToday } from "@/src/features/tasks/utils/constants";
import { getTemplateById } from "@/src/features/gym-checkin/utils/workout-templates";
import type { WorkoutTemplateId } from "@/src/features/gym-checkin/utils/workout-templates";
import type { GymCheckin, GymExercise, GymSet, Task } from "@/src/lib/storage";

export interface DashboardStats {
  todayTotal: number;
  todayCompleted: number;
  todayPending: number;
  todayProgress: number;
  weekCheckins: number;
  totalTasks: number;
  streak: number;
  todaySets: number;
  templateExercisesDone: number;
  templateExercisesTotal: number;
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

function getTodaySets(sets: GymSet[]) {
  const today = new Date().toDateString();
  return sets.filter((s) => new Date(s.timestamp).toDateString() === today);
}

function getTemplateProgress(
  exercises: GymExercise[],
  sets: GymSet[],
  templateId: WorkoutTemplateId | null,
) {
  if (!templateId) return { done: 0, total: 0 };

  const templateExercises = exercises.filter((e) => e.templateId === templateId);
  const today = new Date().toDateString();
  const todayExerciseIds = new Set(
    sets
      .filter((s) => new Date(s.timestamp).toDateString() === today)
      .map((s) => s.exerciseId),
  );

  const done = templateExercises.filter((e) => todayExerciseIds.has(e.id)).length;
  return { done, total: templateExercises.length };
}

export function getDashboardStats(
  tasks: Task[],
  checkins: GymCheckin[],
  sets: GymSet[] = [],
  exercises: GymExercise[] = [],
  activeTemplate: WorkoutTemplateId | null = null,
): DashboardStats {
  const todayTasks = getTasksForToday(tasks);
  const todayCompleted = todayTasks.filter((t) => t.completed).length;
  const todayTotal = todayTasks.length;
  const todayPending = todayTotal - todayCompleted;
  const todayProgress =
    todayTotal === 0 ? 0 : (todayCompleted / todayTotal) * 100;

  const templateProgress = getTemplateProgress(exercises, sets, activeTemplate);

  return {
    todayTotal,
    todayCompleted,
    todayPending,
    todayProgress,
    weekCheckins: getWeekCheckins(checkins),
    totalTasks: tasks.length,
    streak: getCompletionStreak(tasks),
    todaySets: getTodaySets(sets).length,
    templateExercisesDone: templateProgress.done,
    templateExercisesTotal: templateProgress.total,
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
  sets: GymSet[] = [],
  exercises: GymExercise[] = [],
): { id: string; label: string; time: string; meta?: string }[] {
  const exerciseMap = new Map(exercises.map((e) => [e.id, e]));
  const items: {
    id: string;
    label: string;
    time: number;
    meta?: string;
  }[] = [];

  tasks
    .filter((t) => t.completed)
    .forEach((t) => {
      items.push({
        id: `task-${t.id}`,
        label: t.title,
        time: t.createdAt,
        meta: "Tarefa",
      });
    });

  checkins.forEach((c) => {
    items.push({
      id: `gym-${c.id}`,
      label: "Check-in na academia",
      time: c.timestamp,
      meta: "Check-in",
    });
  });

  sets.forEach((s) => {
    const exercise = exerciseMap.get(s.exerciseId);
    items.push({
      id: `set-${s.id}`,
      label: exercise
        ? `${exercise.name} — ${s.weightKg}kg × ${s.reps}`
        : `Série registrada`,
      time: s.timestamp,
      meta: exercise?.templateId
        ? `Treino ${exercise.templateId.toUpperCase()}`
        : "Treino",
    });
  });

  return items
    .sort((a, b) => b.time - a.time)
    .slice(0, 6)
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

export function getPendingTasksPreview(tasks: Task[], limit = 3) {
  return getTasksForToday(tasks)
    .filter((t) => !t.completed)
    .slice(0, limit);
}

export function getWorkoutTemplateLabel(templateId: WorkoutTemplateId | null) {
  if (!templateId) return null;
  const template = getTemplateById(templateId);
  return `Treino ${template.label} · ${template.name}`;
}
