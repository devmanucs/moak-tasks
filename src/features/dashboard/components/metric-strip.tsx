import { GlassCard } from "@/src/components/ui/glass-card";
import { Text, View } from "react-native";

interface MetricStripProps {
  items: { value: string | number; label: string }[];
}

export function MetricStrip({ items }: MetricStripProps) {
  return (
    <GlassCard contentClassName="flex-row px-0 py-0">
      {items.map((item, index) => (
        <View
          key={item.label}
          className={[
            "flex-1 items-center py-5",
            index < items.length - 1 ? "border-r border-white/8" : "",
          ].join(" ")}
        >
          <Text className="font-fraunces text-3xl text-foreground">
            {item.value}
          </Text>
          <Text className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {item.label}
          </Text>
        </View>
      ))}
    </GlassCard>
  );
}
