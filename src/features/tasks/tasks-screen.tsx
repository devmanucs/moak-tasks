import { Button } from "@/src/components/ui/button";
import { PlusIcon } from "@/src/components/ui/icons";
import { ProgressBar } from "@/src/components/ui/progress-bar";
import { TaskCard } from "@/src/components/ui/task-card";
import { Task, storage } from "@/src/lib/storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddTaskSheet } from "./components/add-task-sheet";
import { getTasksForToday } from "./utils/constants";

type Filter = "all" | "pending" | "done";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "pending", label: "Pendentes" },
  { key: "done", label: "Concluídas" },
];

export function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [sheetOpen, setSheetOpen] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    const loadedTasks = await storage.getTasks();
    setTasks(loadedTasks);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks]),
  );

  const todayTasks = useMemo(() => getTasksForToday(tasks), [tasks]);

  const filteredTasks = useMemo(() => {
    if (filter === "pending") return todayTasks.filter((t) => !t.completed);
    if (filter === "done") return todayTasks.filter((t) => t.completed);
    return todayTasks;
  }, [todayTasks, filter]);

  const completedCount = todayTasks.filter((t) => t.completed).length;
  const progress =
    todayTasks.length === 0 ? 0 : (completedCount / todayTasks.length) * 100;

  async function onRefresh() {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  }

  async function handleAddTask(title: string, description?: string) {
    const newTask = await storage.addTask({
      title,
      description,
      completed: false,
      dueDate: new Date().setHours(23, 59, 59, 999),
    });
    setTasks([...tasks, newTask]);
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

  function handleDeleteTask(taskId: string) {
    Alert.alert("Excluir tarefa", "Tem certeza que deseja excluir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await storage.deleteTask(taskId);
          setTasks(tasks.filter((t) => t.id !== taskId));
        },
      },
    ]);
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="px-5 pb-4 pt-4">
        <Text className="font-fraunces text-3xl text-foreground">Tarefas</Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          Organize seu dia com clareza
        </Text>

        <View className="mt-5 rounded-2xl border border-border bg-card p-4">
          <ProgressBar
            progress={progress}
            label="Progresso de hoje"
            showPercent
          />
        </View>

        <View className="mt-4 flex-row gap-2">
          {FILTERS.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setFilter(item.key)}
              className={[
                "rounded-full px-4 py-2",
                filter === item.key ? "bg-primary" : "bg-muted",
              ].join(" ")}
            >
              <Text
                className={[
                  "text-xs font-semibold",
                  filter === item.key
                    ? "text-primary-foreground"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        className="flex-1 px-5"
        contentContainerClassName="pb-28"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => handleToggleTask(item.id)}
            onDelete={() => handleDeleteTask(item.id)}
          />
        )}
        ListEmptyComponent={
          <View className="mt-12 items-center px-6">
            <Text className="text-center text-base font-semibold text-foreground">
              {loading ? "Carregando tarefas..." : "Nenhuma tarefa por aqui"}
            </Text>
            <Text className="mt-2 text-center text-sm text-muted-foreground">
              {loading
                ? "Aguarde um momento"
                : "Toque no + para adicionar sua primeira tarefa do dia"}
            </Text>
          </View>
        }
      />

      <View className="absolute bottom-6 right-5">
        <Button
          onPress={() => setSheetOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg shadow-black/20"
          size="icon"
        >
          <PlusIcon size={22} className="text-primary-foreground" />
        </Button>
      </View>

      <AddTaskSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={handleAddTask}
      />
    </SafeAreaView>
  );
}
