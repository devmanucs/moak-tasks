import { Task } from "@/src/lib/storage";
import { Pressable, Text, View } from "react-native";
import { Trash2 } from "lucide-react-native";

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onDelete?: () => void;
}

export function TaskCard({ task, onPress, onDelete }: TaskCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mx-4 my-2 overflow-hidden rounded-xl border border-gray-200 bg-white"
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

        <View
          className={[
            "h-10 w-10 items-center justify-center rounded-full",
            task.completed ? "bg-emerald-100" : "bg-red-100",
          ].join(" ")}
        >
          <Text
            className={[
              "text-sm font-bold",
              task.completed ? "text-emerald-600" : "text-red-600",
            ].join(" ")}
          >
            {task.completed ? "OK" : ""}
          </Text>
        </View>
      </View>

      {onDelete && (
        <Pressable
          onPress={onDelete}
          className="border-t border-gray-100 px-4 py-2"
        >
          <Text className="text-sm font-semibold text-red-500"><Trash2 /></Text>
        </Pressable>
      )}
    </Pressable>
  );
}
