import {
  CheckCircle2Icon,
  ClockIcon,
  Trash2Icon,
} from "@/src/components/ui/icons";
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
    <Pressable
      onPress={onPress}
      className={cn(
        "mb-3 overflow-hidden rounded-2xl border bg-card shadow-sm shadow-black/5",
        task.completed ? "border-emerald-200 opacity-80" : "border-border",
      )}
    >
      <View className="flex-row items-center justify-between px-4 py-4">
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
              task.completed ? "bg-emerald-100" : "bg-amber-100",
            )}
          >
            {task.completed ? (
              <CheckCircle2Icon size={18} className="text-emerald-600" />
            ) : (
              <ClockIcon size={18} className="text-amber-600" />
            )}
          </View>
          {onDelete ? (
            <Button onPress={onDelete} variant="ghost" size="icon" className="h-9 w-9">
              <Trash2Icon size={16} className="text-destructive" />
            </Button>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
