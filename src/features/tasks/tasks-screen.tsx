import { Button } from "@/src/components/ui/button";
import { GlassCard } from "@/src/components/ui/glass-card";
import { PlusIcon } from "@/src/components/ui/icons";
import { ProgressBar } from "@/src/components/ui/progress-bar";
import { TaskCard } from "@/src/components/ui/task-card";
import { BRAND_CAMEL } from "@/src/lib/colors";
import { Task, storage } from "@/src/lib/storage";
import { useFabBottom, useTabBarInset } from "@/src/lib/use-tab-bar-inset";
import { cn } from "@/src/lib/utils";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Screen } from "@/src/components/ui/screen";
import { AddTaskSheet } from "./components/add-task-sheet";
import {
  DEFAULT_TASK_CATEGORY,
  TASK_CATEGORIES,
  type TaskCategory,
} from "./utils/categories";
import { getTasksForToday } from "./utils/constants";

type StatusFilter = "all" | "pending" | "done";

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "pending", label: "Pendentes" },
  { key: "done", label: "Concluídas" },
];

export function TasksScreen() {
  const fabBottom = useFabBottom();
  const listPaddingBottom = useTabBarInset(80);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | "all">(
    "all",
  );
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
    let result = todayTasks;
    if (statusFilter === "pending") result = result.filter((t) => !t.completed);
    if (statusFilter === "done") result = result.filter((t) => t.completed);
    if (categoryFilter !== "all") {
      result = result.filter(
        (t) => (t.category ?? DEFAULT_TASK_CATEGORY) === categoryFilter,
      );
    }
    return result;
  }, [todayTasks, statusFilter, categoryFilter]);

  const completedCount = todayTasks.filter((t) => t.completed).length;
  const progress =
    todayTasks.length === 0 ? 0 : (completedCount / todayTasks.length) * 100;

  async function onRefresh() {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  }

  async function handleAddTask(
    title: string,
    category: TaskCategory,
    description?: string,
  ) {
    const newTask = await storage.addTask({
      title,
      description,
      category,
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
    <Screen>
      <View className="px-5 pb-4 pt-4">
        <Text className="font-fraunces text-3xl text-foreground">Tarefas</Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          Organize seu dia com clareza
        </Text>

        <GlassCard className="mt-5" contentClassName="p-4">
          <ProgressBar
            progress={progress}
            label="Progresso de hoje"
            showPercent
          />
        </GlassCard>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
          contentContainerClassName="gap-2 pr-2"
        >
          {STATUS_FILTERS.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setStatusFilter(item.key)}
              className={cn(
                "rounded-full px-4 py-2",
                statusFilter === item.key ? "bg-primary/20" : "bg-muted",
              )}
            >
              <Text
                className={cn(
                  "text-xs font-semibold",
                  statusFilter === item.key
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-2"
          contentContainerClassName="gap-2 pr-2"
        >
          <Pressable
            onPress={() => setCategoryFilter("all")}
            className={cn(
              "rounded-full px-3 py-1.5",
              categoryFilter === "all" ? "bg-primary/20" : "bg-muted/80",
            )}
          >
            <Text
              className={cn(
                "text-[11px] font-semibold",
                categoryFilter === "all"
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              Todas categorias
            </Text>
          </Pressable>
          {TASK_CATEGORIES.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => setCategoryFilter(item.id)}
              className={cn(
                "rounded-full px-3 py-1.5",
                categoryFilter === item.id ? item.badgeBg : "bg-muted/80",
              )}
            >
              <Text
                className={cn(
                  "text-[11px] font-semibold",
                  categoryFilter === item.id
                    ? item.badgeText
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: listPaddingBottom }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={BRAND_CAMEL}
          />
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

      <View className="absolute right-5" style={{ bottom: fabBottom }}>
        <Button
          onPress={() => setSheetOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg shadow-black/40"
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
    </Screen>
  );
}
