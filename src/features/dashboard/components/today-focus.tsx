import { GlassCard } from "@/src/components/ui/glass-card";
import { CategoryBadge } from "@/src/components/ui/category-badge";
import type { Task } from "@/src/lib/storage";
import { Text, View } from "react-native";

interface TodayFocusProps {
  tasks: Task[];
}

export function TodayFocus({ tasks }: TodayFocusProps) {
  if (tasks.length === 0) {
    return (
      <GlassCard contentClassName="p-5">
        <Text className="text-sm text-muted-foreground">
          Nada pendente por agora. Bom ritmo.
        </Text>
      </GlassCard>
    );
  }

  return (
    <GlassCard contentClassName="p-0">
      {tasks.map((task, index) => (
        <View
          key={task.id}
          className={[
            "px-4 py-3",
            index < tasks.length - 1 ? "border-b border-white/8" : "",
          ].join(" ")}
        >
          <View className="flex-row items-center justify-between gap-3">
            <Text className="flex-1 text-sm font-medium text-foreground">
              {task.title}
            </Text>
            <CategoryBadge category={task.category} />
          </View>
        </View>
      ))}
    </GlassCard>
  );
}
