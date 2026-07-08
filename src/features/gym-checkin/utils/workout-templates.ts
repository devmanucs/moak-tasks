export type WorkoutTemplateId = "a" | "b" | "c";

export interface WorkoutTemplateExercise {
  name: string;
  equipment?: string;
  muscleGroup?: string;
}

export interface WorkoutTemplate {
  id: WorkoutTemplateId;
  label: string;
  name: string;
  focus: string;
  exercises: WorkoutTemplateExercise[];
}

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: "a",
    label: "A",
    name: "Peito & Tríceps",
    focus: "Empurrar",
    exercises: [
      { name: "Supino reto", equipment: "Barra", muscleGroup: "Peito" },
      { name: "Supino inclinado", equipment: "Halteres", muscleGroup: "Peito" },
      { name: "Crucifixo", equipment: "Cabos", muscleGroup: "Peito" },
      { name: "Tríceps pulley", equipment: "Cabo", muscleGroup: "Tríceps" },
      { name: "Tríceps testa", equipment: "Barra W", muscleGroup: "Tríceps" },
    ],
  },
  {
    id: "b",
    label: "B",
    name: "Costas & Bíceps",
    focus: "Puxar",
    exercises: [
      { name: "Puxada frontal", equipment: "Pulley", muscleGroup: "Costas" },
      { name: "Remada curvada", equipment: "Barra", muscleGroup: "Costas" },
      { name: "Remada máquina", equipment: "Máquina", muscleGroup: "Costas" },
      { name: "Rosca direta", equipment: "Barra", muscleGroup: "Bíceps" },
      { name: "Rosca martelo", equipment: "Halteres", muscleGroup: "Bíceps" },
    ],
  },
  {
    id: "c",
    label: "C",
    name: "Pernas & Ombros",
    focus: "Base",
    exercises: [
      { name: "Agachamento", equipment: "Barra", muscleGroup: "Pernas" },
      { name: "Leg press", equipment: "Máquina", muscleGroup: "Pernas" },
      { name: "Cadeira extensora", equipment: "Máquina", muscleGroup: "Pernas" },
      { name: "Desenvolvimento", equipment: "Halteres", muscleGroup: "Ombros" },
      { name: "Elevação lateral", equipment: "Halteres", muscleGroup: "Ombros" },
    ],
  },
];

export function getTemplateById(id: WorkoutTemplateId) {
  return WORKOUT_TEMPLATES.find((t) => t.id === id)!;
}

export function suggestTemplateForToday(): WorkoutTemplateId {
  const day = new Date().getDay();
  if (day === 1 || day === 4) return "a";
  if (day === 2 || day === 5) return "b";
  return "c";
}
