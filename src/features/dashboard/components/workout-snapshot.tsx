import { GlassCard } from "@/src/components/ui/glass-card";
import { getTemplateById } from "@/src/features/gym-checkin/utils/workout-templates";
import type { WorkoutTemplateId } from "@/src/features/gym-checkin/utils/workout-templates";
import { Pressable, Text, View } from "react-native";

interface WorkoutSnapshotProps {
  templateId: WorkoutTemplateId | null;
  todaySets: number;
  exercisesDone: number;
  exercisesTotal: number;
  onPress: () => void;
}

export function WorkoutSnapshot({
  templateId,
  todaySets,
  exercisesDone,
  exercisesTotal,
  onPress,
}: WorkoutSnapshotProps) {
  const template = templateId ? getTemplateById(templateId) : null;

  return (
    <Pressable onPress={onPress}>
      <GlassCard contentClassName="p-5">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Treino
        </Text>

        {template ? (
          <>
            <View className="mt-2 flex-row items-baseline gap-2">
              <Text className="font-fraunces text-4xl text-primary">
                {template.label}
              </Text>
              <Text className="flex-1 font-fraunces text-lg text-foreground">
                {template.name}
              </Text>
            </View>
            <Text className="mt-3 text-sm text-muted-foreground">
              {todaySets} séries hoje · {exercisesDone}/{exercisesTotal}{" "}
              exercícios com registro
            </Text>
          </>
        ) : (
          <>
            <Text className="mt-2 font-fraunces text-xl text-foreground">
              Escolha um template
            </Text>
            <Text className="mt-2 text-sm text-muted-foreground">
              A, B ou C — carregue na aba Academia para começar o diário.
            </Text>
          </>
        )}

        <Text className="mt-4 text-xs font-semibold text-primary">
          Abrir academia →
        </Text>
      </GlassCard>
    </Pressable>
  );
}
