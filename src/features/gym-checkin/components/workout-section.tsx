import { Button } from "@/src/components/ui/button";
import { GlassCard } from "@/src/components/ui/glass-card";
import { Input } from "@/src/components/ui/input";
import { ExerciseFormSheet } from "@/src/features/gym-checkin/components/exercise-form-sheet";
import { TemplatePicker } from "@/src/features/gym-checkin/components/template-picker";
import {
  formatSet,
  getPreviousBestSet,
  getProgressionLabel,
  getTodaySets,
} from "@/src/features/gym-checkin/utils/workout-stats";
import type { WorkoutTemplateId } from "@/src/features/gym-checkin/utils/workout-templates";
import type { GymExercise, GymSet } from "@/src/lib/storage";
import { storage } from "@/src/lib/storage";
import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

interface WorkoutSectionProps {
  exercises: GymExercise[];
  sets: GymSet[];
  activeTemplate: WorkoutTemplateId;
  onTemplateChange: (id: WorkoutTemplateId) => void;
  onDataChange: () => void;
  onScrollToInput?: () => void;
}

export function WorkoutSection({
  exercises,
  sets,
  activeTemplate,
  onTemplateChange,
  onDataChange,
  onScrollToInput,
}: WorkoutSectionProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<GymExercise | null>(
    null,
  );
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [weightInputs, setWeightInputs] = useState<Record<string, string>>({});
  const [repsInputs, setRepsInputs] = useState<Record<string, string>>({});

  const templateExercises = useMemo(
    () => exercises.filter((e) => e.templateId === activeTemplate),
    [exercises, activeTemplate],
  );

  const handleSaveExercise = useCallback(
    async (data: {
      name: string;
      equipment?: string;
      muscleGroup?: string;
    }) => {
      if (editingExercise) {
        await storage.updateExercise(editingExercise.id, data);
      } else {
        await storage.addExercise({ ...data, templateId: activeTemplate });
      }
      setEditingExercise(null);
      onDataChange();
    },
    [activeTemplate, editingExercise, onDataChange],
  );

  async function handleSelectTemplate(id: WorkoutTemplateId) {
    await storage.setActiveTemplate(id);
    onTemplateChange(id);
    setMenuOpenId(null);
  }

  async function handleApplyTemplate(id: WorkoutTemplateId) {
    await storage.applyWorkoutTemplate(id);
    onTemplateChange(id);
    onDataChange();
    Alert.alert(
      "Template carregado",
      `Treino ${id.toUpperCase()} pronto para registrar séries.`,
    );
  }

  function toggleExpand(exerciseId: string) {
    setMenuOpenId(null);
    const next = expandedId === exerciseId ? null : exerciseId;
    setExpandedId(next);
    if (next) onScrollToInput?.();
  }

  async function handleLogSet(exerciseId: string) {
    const weight = parseFloat(
      (weightInputs[exerciseId] ?? "").replace(",", "."),
    );
    const reps = parseInt(repsInputs[exerciseId] ?? "", 10);

    if (!weight || weight <= 0 || !reps || reps <= 0) {
      Alert.alert("Dados inválidos", "Informe carga (kg) e repetições válidas.");
      return;
    }

    await storage.addSet({
      exerciseId,
      weightKg: weight,
      reps,
      timestamp: Date.now(),
      templateId: activeTemplate,
    });

    setWeightInputs((prev) => ({ ...prev, [exerciseId]: "" }));
    setRepsInputs((prev) => ({ ...prev, [exerciseId]: "" }));
    onDataChange();
  }

  function handleDeleteExercise(exercise: GymExercise) {
    setMenuOpenId(null);
    Alert.alert(
      "Excluir exercício",
      `Remover "${exercise.name}" e todo o histórico?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await storage.deleteExercise(exercise.id);
            if (expandedId === exercise.id) setExpandedId(null);
            onDataChange();
          },
        },
      ],
    );
  }

  function openEdit(exercise: GymExercise) {
    setMenuOpenId(null);
    setEditingExercise(exercise);
    setFormOpen(true);
  }

  async function handleDeleteSet(setId: string) {
    await storage.deleteSet(setId);
    onDataChange();
  }

  return (
    <View className="mt-6">
      <View className="mb-3 flex-row items-end justify-between">
        <View className="flex-1 pr-3">
          <Text className="font-fraunces text-lg text-foreground">
            Diário de treino
          </Text>
          <Text className="text-xs text-muted-foreground">
            Templates A / B / C
          </Text>
        </View>
        <Pressable
          onPress={() => {
            setEditingExercise(null);
            setFormOpen(true);
          }}
          className="rounded-full border border-white/10 px-3 py-2"
        >
          <Text className="text-xs font-semibold text-foreground">
            + Exercício extra
          </Text>
        </Pressable>
      </View>

      <TemplatePicker
        activeId={activeTemplate}
        onSelect={handleSelectTemplate}
        onApply={handleApplyTemplate}
      />

      {templateExercises.length === 0 ? (
        <GlassCard contentClassName="p-6">
          <Text className="text-center text-sm leading-6 text-muted-foreground">
            Selecione um template e toque em Carregar para montar o treino do
            dia.
          </Text>
        </GlassCard>
      ) : (
        <View className="gap-3">
          {templateExercises.map((exercise) => {
            const todaySets = getTodaySets(sets, exercise.id);
            const previousBest = getPreviousBestSet(sets, exercise.id);
            const progression = getProgressionLabel(todaySets, previousBest);
            const isExpanded = expandedId === exercise.id;
            const menuOpen = menuOpenId === exercise.id;

            return (
              <GlassCard key={exercise.id} contentClassName="p-4">
                <View className="relative">
                  <Pressable onPress={() => toggleExpand(exercise.id)}>
                    <View className="flex-row items-start justify-between gap-2">
                      <View className="flex-1 pr-8">
                        <Text className="text-base font-semibold text-foreground">
                          {exercise.name}
                        </Text>
                        <Text className="mt-0.5 text-xs text-muted-foreground">
                          {[exercise.equipment, exercise.muscleGroup]
                            .filter(Boolean)
                            .join(" · ") || "Sem equipamento"}
                        </Text>
                      </View>
                    </View>

                    <Text className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      {todaySets.length} série
                      {todaySets.length !== 1 ? "s" : ""} hoje
                      {previousBest
                        ? ` · último ${formatSet(previousBest)}`
                        : ""}
                    </Text>

                    {progression ? (
                      <Text className="mt-1 text-xs text-emerald-400">
                        {progression}
                      </Text>
                    ) : null}

                    {!isExpanded ? (
                      <Text className="mt-2 text-[11px] text-muted-foreground">
                        Toque para registrar séries
                      </Text>
                    ) : null}
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      setMenuOpenId(menuOpen ? null : exercise.id)
                    }
                    hitSlop={12}
                    className="absolute right-0 top-0 px-1"
                  >
                    <Text className="text-lg leading-5 text-muted-foreground">
                      ···
                    </Text>
                  </Pressable>

                  {menuOpen ? (
                    <View className="absolute right-0 top-7 z-20 min-w-[120px] overflow-hidden rounded-xl border border-white/10 bg-card">
                      <Pressable
                        onPress={() => openEdit(exercise)}
                        className="border-b border-white/8 px-4 py-3"
                      >
                        <Text className="text-sm text-foreground">Editar</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleDeleteExercise(exercise)}
                        className="px-4 py-3"
                      >
                        <Text className="text-sm text-destructive">
                          Excluir
                        </Text>
                      </Pressable>
                    </View>
                  ) : null}
                </View>

                {isExpanded ? (
                  <View className="mt-4 border-t border-white/10 pt-4">
                    {todaySets.length > 0 ? (
                      <View className="mb-4 gap-2">
                        {todaySets.map((set, index) => (
                          <View
                            key={set.id}
                            className="flex-row items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5"
                          >
                            <Text className="text-sm text-foreground">
                              {index + 1}. {formatSet(set)}
                            </Text>
                            <Pressable
                              onPress={() => handleDeleteSet(set.id)}
                              hitSlop={8}
                            >
                              <Text className="text-xs font-semibold text-destructive">
                                Excluir
                              </Text>
                            </Pressable>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <Text className="mb-3 text-xs text-muted-foreground">
                        Nenhuma série registrada hoje.
                      </Text>
                    )}

                    <View className="flex-row gap-2">
                      <View className="flex-1">
                        <Text className="mb-1 text-xs text-muted-foreground">
                          Carga (kg)
                        </Text>
                        <Input
                          value={weightInputs[exercise.id] ?? ""}
                          onChangeText={(v) =>
                            setWeightInputs((prev) => ({
                              ...prev,
                              [exercise.id]: v,
                            }))
                          }
                          onFocus={onScrollToInput}
                          placeholder="40"
                          keyboardType="decimal-pad"
                          className="h-11 rounded-xl"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="mb-1 text-xs text-muted-foreground">
                          Reps
                        </Text>
                        <Input
                          value={repsInputs[exercise.id] ?? ""}
                          onChangeText={(v) =>
                            setRepsInputs((prev) => ({
                              ...prev,
                              [exercise.id]: v,
                            }))
                          }
                          onFocus={onScrollToInput}
                          placeholder="10"
                          keyboardType="number-pad"
                          className="h-11 rounded-xl"
                        />
                      </View>
                    </View>

                    <Button
                      onPress={() => handleLogSet(exercise.id)}
                      className="mt-3 h-11 rounded-xl"
                    >
                      <Text className="text-sm font-semibold text-primary-foreground">
                        Registrar série
                      </Text>
                    </Button>
                  </View>
                ) : null}
              </GlassCard>
            );
          })}
        </View>
      )}

      <ExerciseFormSheet
        visible={formOpen}
        exercise={editingExercise}
        onClose={() => {
          setFormOpen(false);
          setEditingExercise(null);
        }}
        onSubmit={handleSaveExercise}
      />
    </View>
  );
}
