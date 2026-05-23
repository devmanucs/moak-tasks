import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Task {
  id: string;
  title: string;
  description?: string;
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

const TASKS_KEY = "@moak-tasks/tasks";
const GYM_CHECKINS_KEY = "@moak-tasks/gym-checkins";
const GYM_LOCATION_KEY = "@moak-tasks/gym-location";

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
};
