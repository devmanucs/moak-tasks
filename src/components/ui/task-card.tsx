import {
  CheckCircle2Icon,
  ClockIcon,
  Trash2Icon,
} from "@/src/components/ui/icons";
import { Task } from "@/src/lib/storage";
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
      className="mx-4 my-2 overflow-hidden rounded-xl border border-gray-200 bg-white gap-1"
    >
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-1 pr-3">
          <Text className="mb-1 text-base font-semibold text-gray-800">
            {task.title}
          </Text>
          {task.description && (
            <Text className="text-xs text-gray-500">{task.description}</Text>
          )}
        </View>

        <View className="flex-row items-center gap-3">
          <View
            className={[
              "h-10 w-10 items-center justify-center rounded-full",
              task.completed ? "bg-emerald-100" : "bg-amber-100",
            ].join(" ")}
          >
            {task.completed ? (
              <CheckCircle2Icon size={16} className="text-emerald-600" />
            ) : (
              <ClockIcon size={16} className="text-amber-600" />
            )}
          </View>
          {onDelete && (
            <Button onPress={onDelete} variant="outline" size="icon">
              <Trash2Icon size={16} className="text-red-500 " />
            </Button>
          )}
        </View>
      </View>
    </Pressable>
  );
}
