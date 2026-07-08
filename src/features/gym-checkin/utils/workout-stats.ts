import type { GymSet } from "@/src/lib/storage";

function dayKey(timestamp: number) {
  return new Date(timestamp).toDateString();
}

export function getTodaySets(sets: GymSet[], exerciseId: string) {
  const today = dayKey(Date.now());
  return sets
    .filter(
      (s) => s.exerciseId === exerciseId && dayKey(s.timestamp) === today,
    )
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function getPreviousBestSet(
  sets: GymSet[],
  exerciseId: string,
): GymSet | null {
  const today = dayKey(Date.now());
  const previous = sets
    .filter(
      (s) => s.exerciseId === exerciseId && dayKey(s.timestamp) !== today,
    )
    .sort((a, b) => b.timestamp - a.timestamp);

  if (previous.length === 0) return null;

  const lastDay = dayKey(previous[0].timestamp);
  const lastSessionSets = previous.filter((s) => dayKey(s.timestamp) === lastDay);
  return lastSessionSets.reduce<GymSet | null>((best, current) => {
    if (!best) return current;
    if (current.weightKg > best.weightKg) return current;
    if (current.weightKg === best.weightKg && current.reps > best.reps) {
      return current;
    }
    return best;
  }, null);
}

export function getProgressionLabel(
  todaySets: GymSet[],
  previousBest: GymSet | null,
): string | null {
  if (todaySets.length === 0 || !previousBest) return null;

  const todayBest = todaySets.reduce<GymSet>((best, current) => {
    if (current.weightKg > best.weightKg) return current;
    if (current.weightKg === best.weightKg && current.reps > best.reps) {
      return current;
    }
    return best;
  }, todaySets[0]);

  const weightDiff = todayBest.weightKg - previousBest.weightKg;
  const repsDiff = todayBest.reps - previousBest.reps;

  if (weightDiff > 0) return `+${weightDiff}kg vs último treino`;
  if (weightDiff < 0) return `${weightDiff}kg vs último treino`;
  if (repsDiff > 0) return `+${repsDiff} reps vs último treino`;
  if (repsDiff < 0) return `${repsDiff} reps vs último treino`;
  return "Mesma carga do último treino";
}

export function formatSet(set: GymSet) {
  return `${set.weightKg}kg × ${set.reps}`;
}
