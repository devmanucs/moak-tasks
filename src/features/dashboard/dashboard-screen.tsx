import { ProgressBar } from "@/src/components/ui/progress-bar";
import { StatCard } from "@/src/components/ui/stat-card";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  ClockIcon,
  DumbbellIcon,
  FlameIcon,
  TargetIcon,
  TrendingUpIcon,
} from "@/src/components/ui/icons";
import { GymCheckin, Task, storage } from "@/src/lib/storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  formatShortDate,
  getDashboardStats,
  getGreeting,
  getRecentActivity,
  hasCheckedInToday,
} from "./utils/stats";

export function DashboardScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [checkins, setCheckins] = useState<GymCheckin[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [loadedTasks, loadedCheckins] = await Promise.all([
      storage.getTasks(),
      storage.getCheckins(),
    ]);
    setTasks(loadedTasks);
    setCheckins(loadedCheckins);
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

  const stats = getDashboardStats(tasks, checkins);
  const recentActivity = getRecentActivity(tasks, checkins);
  const gymDoneToday = hasCheckedInToday(checkins);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="bg-primary px-6 pb-10 pt-4 rounded-b-[2rem]">
          <View className="mb-1 flex-row items-center gap-2">
            <CalendarDaysIcon size={14} className="text-primary-foreground/70" />
            <Text className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
              {formatShortDate()}
            </Text>
          </View>

          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <Text className="font-fraunces text-4xl text-primary-foreground">
                {getGreeting()}
              </Text>
              <Text className="mt-1 text-base text-primary-foreground/80">
                Seu dia em um só lugar
              </Text>
            </View>
            <Image
              source={require("@/assets/moak-white.png")}
              className="h-20 w-20"
              resizeMode="contain"
            />
          </View>
        </View>

        <View className="-mt-6 px-5">
          <View className="rounded-2xl border border-border bg-card p-5 shadow-md shadow-black/10">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="font-fraunces text-lg text-foreground">
                Progresso de hoje
              </Text>
              <View className="rounded-full bg-secondary/15 px-3 py-1">
                <Text className="text-xs font-semibold text-secondary">
                  {stats.todayCompleted}/{stats.todayTotal} tarefas
                </Text>
              </View>
            </View>
            <ProgressBar progress={stats.todayProgress} showPercent />
            <Text className="mt-3 text-sm text-muted-foreground">
              {stats.todayPending === 0
                ? "Tudo concluído por hoje!"
                : `${stats.todayPending} tarefa${stats.todayPending > 1 ? "s" : ""} pendente${stats.todayPending > 1 ? "s" : ""}`}
            </Text>
          </View>
        </View>

        <View className="mt-5 flex-row gap-3 px-5">
          <StatCard
            label="Concluídas"
            value={stats.todayCompleted}
            icon={CheckCircle2Icon}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-100"
          />
          <StatCard
            label="Pendentes"
            value={stats.todayPending}
            icon={ClockIcon}
            iconColor="text-amber-600"
            iconBg="bg-amber-100"
          />
        </View>

        <View className="mt-3 flex-row gap-3 px-5">
          <StatCard
            label="Sequência"
            value={`${stats.streak}d`}
            icon={FlameIcon}
            iconColor="text-orange-600"
            iconBg="bg-orange-100"
          />
          <StatCard
            label="Academia (7d)"
            value={stats.weekCheckins}
            icon={DumbbellIcon}
            iconColor="text-secondary"
            iconBg="bg-secondary/15"
          />
        </View>

        <View className="mt-6 px-5">
          <Text className="mb-3 font-fraunces text-lg text-foreground">
            Ações rápidas
          </Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => router.push("/tasks")}
              className="flex-1 rounded-2xl border border-border bg-card p-4 active:bg-muted"
            >
              <TargetIcon size={22} className="mb-2 text-primary" />
              <Text className="text-sm font-semibold text-foreground">
                Ver tarefas
              </Text>
              <Text className="mt-1 text-xs text-muted-foreground">
                Gerenciar o dia
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/gym")}
              className="flex-1 rounded-2xl border border-border bg-card p-4 active:bg-muted"
            >
              <DumbbellIcon size={22} className="mb-2 text-secondary" />
              <Text className="text-sm font-semibold text-foreground">
                Check-in
              </Text>
              <Text className="mt-1 text-xs text-muted-foreground">
                {gymDoneToday ? "Feito hoje ✓" : "Registrar treino"}
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="mt-6 px-5">
          <View className="mb-3 flex-row items-center gap-2">
            <TrendingUpIcon size={18} className="text-muted-foreground" />
            <Text className="font-fraunces text-lg text-foreground">
              Atividade recente
            </Text>
          </View>

          {recentActivity.length === 0 ? (
            <View className="rounded-2xl border border-dashed border-border bg-muted/30 p-6">
              <Text className="text-center text-sm text-muted-foreground">
                Nenhuma atividade ainda. Comece completando uma tarefa ou
                fazendo check-in na academia.
              </Text>
            </View>
          ) : (
            <View className="gap-2">
              {recentActivity.map((item) => (
                <View
                  key={item.id}
                  className="flex-row items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
                >
                  <View
                    className={[
                      "h-9 w-9 items-center justify-center rounded-full",
                      item.type === "gym" ? "bg-secondary/15" : "bg-emerald-100",
                    ].join(" ")}
                  >
                    {item.type === "gym" ? (
                      <DumbbellIcon size={16} className="text-secondary" />
                    ) : (
                      <CheckCircle2Icon size={16} className="text-emerald-600" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-foreground">
                      {item.label}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      {item.time}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
