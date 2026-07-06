import { Task } from "@/src/lib/storage";

export const getTasksForToday = (tasks: Task[]) => {
  return tasks.filter((task) => {
    if (!task.dueDate) return true;

    const today = new Date();
    const taskDate = new Date(task.dueDate);

    return taskDate.toDateString() === today.toDateString();
  });
};

export const todayTasks: Task[] = [];