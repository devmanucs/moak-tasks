import type { IconComponent } from "@/src/components/ui/icons";
import { GlassCard } from "@/src/components/ui/glass-card";
import { cn } from "@/src/lib/utils";
import { Text, View } from "react-native";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: IconComponent;
  iconColor?: string;
  iconBg?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/15",
  className,
}: StatCardProps) {
  return (
    <GlassCard className={cn("flex-1", className)} contentClassName="p-4">
      <View
        className={cn(
          "mb-3 h-10 w-10 items-center justify-center rounded-xl",
          iconBg,
        )}
      >
        <Icon size={20} className={iconColor} />
      </View>
      <Text className="font-fraunces text-2xl text-foreground">{value}</Text>
      <Text className="mt-1 text-xs font-medium text-muted-foreground">
        {label}
      </Text>
    </GlassCard>
  );
}
