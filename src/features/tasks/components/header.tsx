import { CalendarDaysIcon } from "@/src/components/ui/icons";
import { Task } from "@/src/lib/storage";
import { useEffect, useRef } from "react";
import { Animated, Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  todayTasks: Task[];
}

export function Header({ todayTasks }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        // Vai para 100% de opacidade
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000, // 1 segundo
          useNativeDriver: true,
        }),
        // Volta para 40% de opacidade
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1000, // 1 segundo
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  const completedCount = todayTasks.filter((t) => t.completed).length;
  const formattedDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <View
      className="px-6 pb-8 bg-primary rounded-b-[2rem] shadow-sm"
      style={{ paddingTop: insets.top + 64 }}
    >
      <View className="mb-2 gap-2 flex-row justify-start items-center">
        <CalendarDaysIcon size={16} className="text-primary-foreground" />
        <Text className="text-primary-foreground text-xs font-semibold uppercase tracking-widest">
          {formattedDate}
        </Text>
      </View>

      <View className="absolute right-6 top-28">
        <Image
          source={require("@/assets/moak-white.png")}
          className="w-40 h-40"
          resizeMode="contain"
        />
      </View>

      <View className="mb-3">
        <Text className="text-5xl text-primary-foreground font-fraunces tracking-tight">
          moak
        </Text>
      </View>

      <View className="flex-row items-center">
        <View className="bg-white/15 px-3 py-1.5 rounded-full border border-white/20 flex-row items-center">
          <Animated.View
            style={{ opacity: pulseAnim }}
            className="w-2 h-2 rounded-full bg-emerald-400 mr-2"
          />
          <Text className="text-sm text-primary-foreground font-medium">
            {completedCount} de {todayTasks.length} concluídas {":)"}
          </Text>
        </View>
      </View>
    </View>
  );
}
