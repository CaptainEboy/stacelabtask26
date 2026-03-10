import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}



const TASKS_STORAGE_KEY = 'tasks';

export async function initializeDatabase(): Promise<void> {
  try {
//    await AsyncStorage.setItem("test", "hello");
//const value = await AsyncStorage.getItem("test");
//console.log(value);
    const existing = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    console.log(existing);
  if (!existing) {
     await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

export async function getAllTasks(): Promise<Task[]> {
  try {
    const data = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Get all tasks failed:', error);
    throw error;
  }
}

export async function addTask(title: string): Promise<Task> {
  const id = Date.now().toString();
  const now = Date.now();

  const newTask: Task = {
    id,
    title,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const tasks = await getAllTasks();
    tasks.unshift(newTask);
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    return newTask;
  } catch (error) {
    console.error('Add task failed:', error);
    throw error;
  }
}

export async function updateTask(id: string, completed: boolean): Promise<void> {
  const now = Date.now();

  try {
    const tasks = await getAllTasks();
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed, updatedAt: now } : t
    );
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Update task failed:', error);
    throw error;
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    const tasks = await getAllTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Delete task failed:', error);
    throw error;
  }
}
