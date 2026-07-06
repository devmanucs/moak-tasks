import { cn } from "@/src/lib/utils";
import { Text, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  className,
}: StatCardProps) {
  return (
    <View
      className={cn(
        "flex-1 rounded-2xl border border-border bg-card p-4 shadow-sm shadow-black/5",
        className,
      )}
    >
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
    </View>
  );
}
