import { CategoryBadge } from "@/src/components/ui/category-badge";
import { GlassCard } from "@/src/components/ui/glass-card";
import {
  DEFAULT_TASK_CATEGORY,
  TASK_CATEGORIES,
  type TaskCategory,
} from "@/src/features/tasks/utils/categories";
import type { Task } from "@/src/lib/storage";
import { Text, View } from "react-native";

interface CategoryBreakdownProps {
  tasks: Task[];
}

export function CategoryBreakdown({ tasks }: CategoryBreakdownProps) {
  const rows = TASK_CATEGORIES.map((cat) => {
    const categoryTasks = tasks.filter(
      (t) => (t.category ?? DEFAULT_TASK_CATEGORY) === cat.id,
    );
    const done = categoryTasks.filter((t) => t.completed).length;
    const total = categoryTasks.length;
    const progress = total === 0 ? 0 : (done / total) * 100;
    return { ...cat, done, total, progress };
  }).filter((row) => row.total > 0);

  if (rows.length === 0) {
    return (
      <GlassCard contentClassName="p-5">
        <Text className="text-sm text-muted-foreground">
          Nenhuma tarefa categorizada hoje.
        </Text>
      </GlassCard>
    );
  }

  return (
    <View className="gap-2">
      {rows.map((row) => (
        <GlassCard key={row.id} contentClassName="p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <CategoryBadge category={row.id as TaskCategory} />
            <Text className="text-xs font-medium text-muted-foreground">
              {row.done}/{row.total}
            </Text>
          </View>
          <View className="h-1.5 overflow-hidden rounded-full bg-muted">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${row.progress}%` }}
            />
          </View>
        </GlassCard>
      ))}
    </View>
  );
}
