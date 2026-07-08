import AsyncStorage from "@react-native-async-storage/async-storage";
import type { TaskCategory } from "@/src/features/tasks/utils/categories";
import {
  WORKOUT_TEMPLATES,
  type WorkoutTemplateId,
} from "@/src/features/gym-checkin/utils/workout-templates";

export interface Task {
  id: string;
  title: string;
  description?: string;
  category?: TaskCategory;
  completed: boolean;
  createdAt: number;
  dueDate?: number;
}

export interface GymCheckin {
  id: string;
  taskId: string;
  timestamp: number;
  notes?: string;
  latitude: number;
  longitude: number;
}

export interface GymExercise {
  id: string;
  name: string;
  equipment?: string;
  muscleGroup?: string;
  templateId?: WorkoutTemplateId;
  createdAt: number;
}

export interface GymSet {
  id: string;
  exerciseId: string;
  weightKg: number;
  reps: number;
  timestamp: number;
  templateId?: WorkoutTemplateId;
  notes?: string;
}

const TASKS_KEY = "@moak-tasks/tasks";
const GYM_CHECKINS_KEY = "@moak-tasks/gym-checkins";
const GYM_LOCATION_KEY = "@moak-tasks/gym-location";
const GYM_EXERCISES_KEY = "@moak-tasks/gym-exercises";
const GYM_SETS_KEY = "@moak-tasks/gym-sets";
const GYM_ACTIVE_TEMPLATE_KEY = "@moak-tasks/gym-active-template";

export const storage = {
  // Tasks
  async getTasks(): Promise<Task[]> {
    try {
      const data = await AsyncStorage.getItem(TASKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao buscar tasks:", error);
      return [];
    }
  },

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Erro ao salvar tasks:", error);
    }
  },

  async addTask(task: Omit<Task, "id" | "createdAt">): Promise<Task> {
    const tasks = await this.getTasks();
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    tasks.push(newTask);
    await this.saveTasks(tasks);
    return newTask;
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      await this.saveTasks(tasks);
    }
  },

  async deleteTask(id: string): Promise<void> {
    const tasks = await this.getTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    await this.saveTasks(filtered);
  },

  // Gym Checkins
  async getCheckins(): Promise<GymCheckin[]> {
    try {
      const data = await AsyncStorage.getItem(GYM_CHECKINS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao buscar checkins:", error);
      return [];
    }
  },

  async saveCheckin(checkin: Omit<GymCheckin, "id">): Promise<GymCheckin> {
    const checkins = await this.getCheckins();
    const newCheckin: GymCheckin = {
      ...checkin,
      id: Date.now().toString(),
    };
    checkins.push(newCheckin);
    await AsyncStorage.setItem(GYM_CHECKINS_KEY, JSON.stringify(checkins));
    return newCheckin;
  },

  // Gym Location
  async setGymLocation(latitude: number, longitude: number): Promise<void> {
    try {
      await AsyncStorage.setItem(
        GYM_LOCATION_KEY,
        JSON.stringify({ latitude, longitude }),
      );
    } catch (error) {
      console.error("Erro ao salvar localização da academia:", error);
    }
  },

  async getGymLocation(): Promise<{
    latitude: number;
    longitude: number;
  } | null> {
    try {
      const data = await AsyncStorage.getItem(GYM_LOCATION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Erro ao buscar localização da academia:", error);
      return null;
    }
  },

  // Gym exercises & sets
  async getExercises(): Promise<GymExercise[]> {
    try {
      const data = await AsyncStorage.getItem(GYM_EXERCISES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao buscar exercícios:", error);
      return [];
    }
  },

  async saveExercises(exercises: GymExercise[]): Promise<void> {
    await AsyncStorage.setItem(GYM_EXERCISES_KEY, JSON.stringify(exercises));
  },

  async addExercise(
    exercise: Omit<GymExercise, "id" | "createdAt">,
  ): Promise<GymExercise> {
    const exercises = await this.getExercises();
    const newExercise: GymExercise = {
      ...exercise,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    exercises.push(newExercise);
    await this.saveExercises(exercises);
    return newExercise;
  },

  async deleteExercise(id: string): Promise<void> {
    const exercises = await this.getExercises();
    await this.saveExercises(exercises.filter((e) => e.id !== id));
    const sets = await this.getSets();
    await this.saveSets(sets.filter((s) => s.exerciseId !== id));
  },

  async updateExercise(
    id: string,
    updates: Partial<Pick<GymExercise, "name" | "equipment" | "muscleGroup">>,
  ): Promise<void> {
    const exercises = await this.getExercises();
    const index = exercises.findIndex((e) => e.id === id);
    if (index === -1) return;
    exercises[index] = { ...exercises[index], ...updates };
    await this.saveExercises(exercises);
  },

  async getSets(): Promise<GymSet[]> {
    try {
      const data = await AsyncStorage.getItem(GYM_SETS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao buscar séries:", error);
      return [];
    }
  },

  async saveSets(sets: GymSet[]): Promise<void> {
    await AsyncStorage.setItem(GYM_SETS_KEY, JSON.stringify(sets));
  },

  async addSet(set: Omit<GymSet, "id">): Promise<GymSet> {
    const sets = await this.getSets();
    const newSet: GymSet = {
      ...set,
      id: Date.now().toString(),
    };
    sets.push(newSet);
    await this.saveSets(sets);
    return newSet;
  },

  async deleteSet(id: string): Promise<void> {
    const sets = await this.getSets();
    await this.saveSets(sets.filter((s) => s.id !== id));
  },

  async getActiveTemplate(): Promise<WorkoutTemplateId | null> {
    try {
      const data = await AsyncStorage.getItem(GYM_ACTIVE_TEMPLATE_KEY);
      return data ? (data as WorkoutTemplateId) : null;
    } catch {
      return null;
    }
  },

  async setActiveTemplate(id: WorkoutTemplateId): Promise<void> {
    await AsyncStorage.setItem(GYM_ACTIVE_TEMPLATE_KEY, id);
  },

  async applyWorkoutTemplate(id: WorkoutTemplateId): Promise<void> {
    const template = WORKOUT_TEMPLATES.find((t) => t.id === id);
    if (!template) return;

    const exercises = await this.getExercises();
    const existingKeys = new Set(
      exercises.map((e) => `${e.templateId}:${e.name.toLowerCase()}`),
    );

    for (const item of template.exercises) {
      const key = `${id}:${item.name.toLowerCase()}`;
      if (existingKeys.has(key)) continue;
      exercises.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: item.name,
        equipment: item.equipment,
        muscleGroup: item.muscleGroup,
        templateId: id,
        createdAt: Date.now(),
      });
    }

    await this.saveExercises(exercises);
    await this.setActiveTemplate(id);
  },
};
