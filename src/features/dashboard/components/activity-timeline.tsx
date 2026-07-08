import { GlassCard } from "@/src/components/ui/glass-card";
import { Text, View } from "react-native";

export interface ActivityItem {
  id: string;
  label: string;
  time: string;
  meta?: string;
}

interface ActivityTimelineProps {
  items: ActivityItem[];
}

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  if (items.length === 0) {
    return (
      <GlassCard contentClassName="p-5">
        <Text className="text-sm leading-6 text-muted-foreground">
          Sem movimentação registrada. Complete uma tarefa ou registre uma série
          na academia.
        </Text>
      </GlassCard>
    );
  }

  return (
    <GlassCard contentClassName="px-4 py-2">
      {items.map((item, index) => (
        <View
          key={item.id}
          className={[
            "flex-row gap-3 py-3",
            index < items.length - 1 ? "border-b border-white/8" : "",
          ].join(" ")}
        >
          <View className="w-1 rounded-full bg-primary/60" />
          <View className="flex-1">
            <Text className="text-sm font-medium text-foreground">
              {item.label}
            </Text>
            <View className="mt-1 flex-row items-center gap-2">
              <Text className="text-xs text-muted-foreground">{item.time}</Text>
              {item.meta ? (
                <Text className="text-xs text-primary">{item.meta}</Text>
              ) : null}
            </View>
          </View>
        </View>
      ))}
    </GlassCard>
  );
}
