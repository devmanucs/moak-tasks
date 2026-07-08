import { Button } from "@/src/components/ui/button";
import { GlassCard } from "@/src/components/ui/glass-card";
import { Input } from "@/src/components/ui/input";
import type { GymExercise } from "@/src/lib/storage";
import { cn } from "@/src/lib/utils";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MUSCLE_GROUPS = [
  "Peito",
  "Costas",
  "Pernas",
  "Ombros",
  "Bíceps",
  "Tríceps",
  "Core",
  "Cardio",
  "Outro",
];

interface ExerciseFormSheetProps {
  visible: boolean;
  exercise?: GymExercise | null;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    equipment?: string;
    muscleGroup?: string;
  }) => void;
}

export function ExerciseFormSheet({
  visible,
  exercise,
  onClose,
  onSubmit,
}: ExerciseFormSheetProps) {
  const insets = useSafeAreaInsets();
  const isEditing = Boolean(exercise);
  const [name, setName] = useState("");
  const [equipment, setEquipment] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setName(exercise?.name ?? "");
    setEquipment(exercise?.equipment ?? "");
    setMuscleGroup(exercise?.muscleGroup ?? null);
  }, [visible, exercise]);

  function reset() {
    setName("");
    setEquipment("");
    setMuscleGroup(null);
  }

  function handleSubmit() {
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      equipment: equipment.trim() || undefined,
      muscleGroup: muscleGroup ?? undefined,
    });
    reset();
    onClose();
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 justify-end">
          <Pressable
            className="absolute inset-0 bg-black/60"
            onPress={handleClose}
          />

          <GlassCard
            className="max-h-[85%] rounded-b-none rounded-t-3xl"
            contentClassName="px-0 pt-0"
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: 16,
                paddingBottom: insets.bottom + 24,
              }}
            >
              <View className="mb-6 flex-row items-center justify-between">
                <Text className="font-fraunces text-xl text-foreground">
                  {isEditing ? "Editar exercício" : "Novo exercício"}
                </Text>
                <Pressable onPress={handleClose} hitSlop={8}>
                  <Text className="text-sm font-semibold text-muted-foreground">
                    Fechar
                  </Text>
                </Pressable>
              </View>

              <Text className="mb-2 text-sm font-medium text-muted-foreground">
                Nome do exercício
              </Text>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="Ex: Supino reto"
                className="mb-4 h-12 rounded-xl"
              />

              <Text className="mb-2 text-sm font-medium text-muted-foreground">
                Máquina / equipamento (opcional)
              </Text>
              <Input
                value={equipment}
                onChangeText={setEquipment}
                placeholder="Ex: Smith, halteres..."
                className="mb-4 h-12 rounded-xl"
              />

              <Text className="mb-2 text-sm font-medium text-muted-foreground">
                Grupo muscular
              </Text>
              <View className="mb-6 flex-row flex-wrap gap-2">
                {MUSCLE_GROUPS.map((group) => (
                  <Pressable
                    key={group}
                    onPress={() =>
                      setMuscleGroup(muscleGroup === group ? null : group)
                    }
                    className={cn(
                      "rounded-full px-3 py-2",
                      muscleGroup === group ? "bg-primary/20" : "bg-muted",
                    )}
                  >
                    <Text
                      className={cn(
                        "text-xs font-semibold",
                        muscleGroup === group
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      {group}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Button
                onPress={handleSubmit}
                disabled={!name.trim()}
                className="h-12 rounded-xl"
              >
                <Text className="text-sm font-semibold text-primary-foreground">
                  {isEditing ? "Salvar alterações" : "Cadastrar exercício"}
                </Text>
              </Button>
            </ScrollView>
          </GlassCard>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
