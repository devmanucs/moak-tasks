import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { TaskCard } from "@/src/components/ui/task-card";
import { Task, storage } from "@/src/lib/storage";
import { useEffect, useState } from "react";
import { PlusCircleIcon } from '@/src/components/ui/icons';
import { Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function HomeScreenFeature() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    const loadedTasks = await storage.getTasks();
    setTasks(loadedTasks);
    setLoading(false);
  }

  async function handleAddTask() {
    if (!newTaskTitle.trim()) {
      Alert.alert("Erro", "Digite o nome da tarefa");
      return;
    }

    const newTask = await storage.addTask({
      title: newTaskTitle,
      completed: false,
      dueDate: new Date().setHours(23, 59, 59, 999),
    });

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  }

  async function handleToggleTask(taskId: string) {
    const task = tasks.find((t) => t.id === taskId);

    if (task) {
      await storage.updateTask(taskId, { completed: !task.completed });
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t,
        ),
      );
    }
  }

  async function handleDeleteTask(taskId: string) {
    await storage.deleteTask(taskId);
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  const todayTasks = tasks.filter((task) => {
    if (!task.dueDate) return true;

    const today = new Date();
    const taskDate = new Date(task.dueDate);

    return taskDate.toDateString() === today.toDateString();
  });

  const completedCount = todayTasks.filter((t) => t.completed).length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pb-2 pt-4">
        <Text className="text-3xl font-bold text-gray-800">
          tasks of the day
        </Text>
        <Text className="mt-1 text-sm text-gray-500">
          {completedCount} de {todayTasks.length} concluidas :)
        </Text>
      </View>

      <View className="flex-row gap-2 px-4 py-3">
        <Input
          className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800"
          placeholder="o que tem pra hoje?"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          placeholderTextColor="#9ca3af"
        />
        <Button onPress={handleAddTask} className="w-fit" variant="default">r
          <View className="flex-row items-center gap-2">
            <PlusCircleIcon size={16} className="text-primary-foreground"/>
            <Text className="text-primary-foreground font-semibold">
              Adicionar
            </Text>
          </View>
        </Button>
      </View>

      <FlatList
        data={todayTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => handleToggleTask(item.id)}
            onDelete={() => handleDeleteTask(item.id)}
          />
        )}
        contentContainerClassName="py-3"
        ListEmptyComponent={
          <Text className="mt-8 text-center text-base text-gray-400">
            {loading ? "carregando tarefas..." : "finalmente sem tarefas"}
          </Text>
        }
      />

      <View className="border-t border-gray-200 bg-white px-4 py-4">
        <Button
          onPress={() =>
            Alert.alert("Em desenvolvimento", "Check-in na academia")
          }
          variant="default"
          className="w-full"
        >
          <Text className="text-primary-foreground">treinei hoje, haha</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
