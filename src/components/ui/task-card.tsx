import { CategoryBadge } from "@/src/components/ui/category-badge";
import {
  CheckCircle2Icon,
  ClockIcon,
  Trash2Icon,
} from "@/src/components/ui/icons";
import { GlassCard } from "@/src/components/ui/glass-card";
import { Task } from "@/src/lib/storage";
import { cn } from "@/src/lib/utils";
import { Pressable, Text, View } from "react-native";
import { Button } from "./button";

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onDelete?: () => void;
}

export function TaskCard({ task, onPress, onDelete }: TaskCardProps) {
  return (
    <Pressable onPress={onPress} className="mb-3">
      <GlassCard
        contentClassName="px-4 py-4"
        className={cn(task.completed && "opacity-75")}
      >
        <View className="mb-2">
          <CategoryBadge category={task.category} />
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text
              className={cn(
                "text-base font-semibold text-foreground",
                task.completed && "text-muted-foreground line-through",
              )}
            >
              {task.title}
            </Text>
            {task.description ? (
              <Text className="mt-1 text-xs text-muted-foreground">
                {task.description}
              </Text>
            ) : null}
          </View>

          <View className="flex-row items-center gap-2">
            <View
              className={cn(
                "h-10 w-10 items-center justify-center rounded-full",
                task.completed ? "bg-emerald-500/15" : "bg-amber-500/15",
              )}
            >
              {task.completed ? (
                <CheckCircle2Icon size={18} className="text-emerald-400" />
              ) : (
                <ClockIcon size={18} className="text-amber-400" />
              )}
            </View>
            {onDelete ? (
              <Button
                onPress={onDelete}
                variant="ghost"
                size="icon"
                className="h-9 w-9"
              >
                <Trash2Icon size={16} className="text-destructive" />
              </Button>
            ) : null}
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
}
