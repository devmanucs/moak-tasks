import { cn } from "@/src/lib/utils";
import { Text, View } from "react-native";

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercent?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  label,
  showPercent = true,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <View className={cn("gap-2", className)}>
      {(label || showPercent) && (
        <View className="flex-row items-center justify-between">
          {label ? (
            <Text className="text-sm font-medium text-foreground">{label}</Text>
          ) : (
            <View />
          )}
          {showPercent && (
            <Text className="text-sm font-semibold text-secondary">
              {Math.round(clamped)}%
            </Text>
          )}
        </View>
      )}
      <View className="h-3 overflow-hidden rounded-full bg-muted">
        <View
          className="h-full rounded-full bg-primary"
          style={{ width: `${clamped}%` }}
        />
      </View>
    </View>
  );
}
