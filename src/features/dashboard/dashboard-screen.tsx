import { ActivityTimeline } from "@/src/features/dashboard/components/activity-timeline";
import { CategoryBreakdown } from "@/src/features/dashboard/components/category-breakdown";
import { MetricStrip } from "@/src/features/dashboard/components/metric-strip";
import { TodayFocus } from "@/src/features/dashboard/components/today-focus";
import { WorkoutSnapshot } from "@/src/features/dashboard/components/workout-snapshot";
import { GlassCard } from "@/src/components/ui/glass-card";
import { ProgressBar } from "@/src/components/ui/progress-bar";
import { BRAND_CAMEL } from "@/src/lib/colors";
import type {
  GymCheckin,
  GymExercise,
  GymSet,
  Task,
} from "@/src/lib/storage";
import { storage } from "@/src/lib/storage";
import { useTabBarInset } from "@/src/lib/use-tab-bar-inset";
import type { WorkoutTemplateId } from "@/src/features/gym-checkin/utils/workout-templates";
import { suggestTemplateForToday } from "@/src/features/gym-checkin/utils/workout-templates";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Screen } from "@/src/components/ui/screen";
import {
  formatShortDate,
  getDashboardStats,
  getGreeting,
  getPendingTasksPreview,
  getRecentActivity,
} from "./utils/stats";
import { getTasksForToday } from "@/src/features/tasks/utils/constants";

export function DashboardScreen() {
  const router = useRouter();
  const listPaddingBottom = useTabBarInset(24);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [checkins, setCheckins] = useState<GymCheckin[]>([]);
  const [exercises, setExercises] = useState<GymExercise[]>([]);
  const [sets, setSets] = useState<GymSet[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<WorkoutTemplateId | null>(
    null,
  );
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [loadedTasks, loadedCheckins, loadedExercises, loadedSets, template] =
      await Promise.all([
        storage.getTasks(),
        storage.getCheckins(),
        storage.getExercises(),
        storage.getSets(),
        storage.getActiveTemplate(),
      ]);

    setTasks(loadedTasks);
    setCheckins(loadedCheckins);
    setExercises(loadedExercises);
    setSets(loadedSets);
    setActiveTemplate(template ?? suggestTemplateForToday());
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  const stats = getDashboardStats(
    tasks,
    checkins,
    sets,
    exercises,
    activeTemplate,
  );
  const todayTasks = getTasksForToday(tasks);
  const pendingPreview = getPendingTasksPreview(tasks);
  const recentActivity = getRecentActivity(tasks, checkins, sets, exercises);

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: listPaddingBottom }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={BRAND_CAMEL}
          />
        }
      >
        <View className="px-6 pb-2 pt-4">
          <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {formatShortDate()}
          </Text>
          <Text className="mt-2 font-fraunces text-[2.75rem] leading-tight text-foreground">
            {getGreeting()}
          </Text>
        </View>

        <View className="px-5 pt-4">
          <GlassCard contentClassName="p-5">
            <View className="mb-1 flex-row items-end justify-between">
              <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Hoje
              </Text>
              <Text className="font-fraunces text-3xl text-foreground">
                {Math.round(stats.todayProgress)}%
              </Text>
            </View>
            <ProgressBar progress={stats.todayProgress} showPercent={false} />
            <Text className="mt-3 text-sm text-muted-foreground">
              {stats.todayCompleted} de {stats.todayTotal} tarefas ·{" "}
              {stats.todaySets} séries registradas
            </Text>
          </GlassCard>
        </View>

        <View className="mt-4 px-5">
          <MetricStrip
            items={[
              { value: stats.todayPending, label: "Abertas" },
              { value: stats.todaySets, label: "Séries" },
              { value: stats.weekCheckins, label: "Check-ins" },
              { value: `${stats.streak}d`, label: "Sequência" },
            ]}
          />
        </View>

        <View className="mt-6 px-5">
          <WorkoutSnapshot
            templateId={activeTemplate}
            todaySets={stats.todaySets}
            exercisesDone={stats.templateExercisesDone}
            exercisesTotal={stats.templateExercisesTotal}
            onPress={() => router.push("/gym")}
          />
        </View>

        <View className="mt-6 px-5">
          <View className="mb-3 flex-row items-end justify-between">
            <Text className="font-fraunces text-lg text-foreground">
              Próximas
            </Text>
            <Pressable onPress={() => router.push("/tasks")}>
              <Text className="text-xs font-semibold text-primary">
                Ver todas
              </Text>
            </Pressable>
          </View>
          <TodayFocus tasks={pendingPreview} />
        </View>

        {todayTasks.length > 0 ? (
          <View className="mt-6 px-5">
            <Text className="mb-3 font-fraunces text-lg text-foreground">
              Por categoria
            </Text>
            <CategoryBreakdown tasks={todayTasks} />
          </View>
        ) : null}

        <View className="mt-6 px-5">
          <Text className="mb-3 font-fraunces text-lg text-foreground">
            Registro
          </Text>
          <ActivityTimeline items={recentActivity} />
        </View>
      </ScrollView>
    </Screen>
  );
}
