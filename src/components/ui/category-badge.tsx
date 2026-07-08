import {
  getCategoryMeta,
  type TaskCategory,
} from "@/src/features/tasks/utils/categories";
import { cn } from "@/src/lib/utils";
import { Text, View } from "react-native";

interface CategoryBadgeProps {
  category?: TaskCategory;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const meta = getCategoryMeta(category);

  return (
    <View
      className={cn("self-start rounded-full px-2.5 py-0.5", meta.badgeBg, className)}
    >
      <Text className={cn("text-[10px] font-semibold uppercase", meta.badgeText)}>
        {meta.label}
      </Text>
    </View>
  );
}
