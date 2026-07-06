import { Button } from "@/src/components/ui/button";
import { PlusIcon } from "@/src/components/ui/icons";
import { TaskCard } from "@/src/components/ui/task-card";
import { Task, storage } from "@/src/lib/storage";
import { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "./components/header";
import { getTasksForToday } from "./utils/constants";

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

  return (
    <SafeAreaView
      edges={["right", "bottom", "left"]}
      className="flex-1 bg-gray-50"
    >
      <Header todayTasks={getTasksForToday(tasks)} />
      <View className="flex-1 px-6 pt-12 justify-center items-center">
        <FlatList
          data={getTasksForToday(tasks)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onPress={() => handleToggleTask(item.id)}
              onDelete={() => handleDeleteTask(item.id)}
            />
          )}
          contentContainerClassName="flex-grow justify-center items-center"
          ListEmptyComponent={
            <Text className="text-center text-base text-primary font-semibold">
              {loading ? "carregando tarefas..." : "finalmente sem tarefas"}
            </Text>
          }
        />
      </View>

      <View className="flex-row justify-end px-3 py-5">
        <Button
          onPress={handleAddTask}
          className="rounded-full items-center gap-2 w-16 h-16"
          variant="default"
          size="icon"
        >
          <PlusIcon size={16} className="text-primary-foreground" />
        </Button>
      </View>
    </SafeAreaView>
  );
}
