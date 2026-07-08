import { GlassCard } from "@/src/components/ui/glass-card";
import {
  WORKOUT_TEMPLATES,
  type WorkoutTemplateId,
} from "@/src/features/gym-checkin/utils/workout-templates";
import { cn } from "@/src/lib/utils";
import { Pressable, Text, View } from "react-native";

interface TemplatePickerProps {
  activeId: WorkoutTemplateId;
  onSelect: (id: WorkoutTemplateId) => void;
  onApply: (id: WorkoutTemplateId) => void;
}

export function TemplatePicker({
  activeId,
  onSelect,
  onApply,
}: TemplatePickerProps) {
  const active = WORKOUT_TEMPLATES.find((t) => t.id === activeId)!;

  return (
    <View className="mb-4">
      <View className="mb-3 flex-row gap-2">
        {WORKOUT_TEMPLATES.map((template) => {
          const selected = template.id === activeId;
          return (
            <Pressable
              key={template.id}
              onPress={() => onSelect(template.id)}
              className={cn(
                "flex-1 rounded-2xl border px-3 py-3",
                selected
                  ? "border-primary/40 bg-primary/10"
                  : "border-white/8 bg-muted/40",
              )}
            >
              <Text
                className={cn(
                  "font-fraunces text-2xl",
                  selected ? "text-primary" : "text-muted-foreground",
                )}
              >
                {template.label}
              </Text>
              <Text
                className={cn(
                  "mt-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  selected ? "text-foreground" : "text-muted-foreground",
                )}
                numberOfLines={1}
              >
                {template.focus}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <GlassCard contentClassName="p-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Template {active.label}
            </Text>
            <Text className="mt-1 font-fraunces text-lg text-foreground">
              {active.name}
            </Text>
            <Text className="mt-2 text-xs leading-5 text-muted-foreground">
              {active.exercises.map((e) => e.name).join(" · ")}
            </Text>
          </View>
          <Pressable
            onPress={() => onApply(activeId)}
            className="rounded-xl bg-primary px-3 py-2"
          >
            <Text className="text-xs font-semibold text-primary-foreground">
              Carregar
            </Text>
          </Pressable>
        </View>
      </GlassCard>
    </View>
  );
}
