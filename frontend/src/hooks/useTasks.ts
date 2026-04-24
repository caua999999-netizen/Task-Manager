import { useState, useEffect, useRef } from 'react';
import { tasksService } from '../services/tasks';
import type { CreateTaskData, UpdateTaskData } from '../services/tasks';
import type { Task } from '../types';

export function useTasks(projectId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(!!projectId);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    if (!projectId) {
      return;
    }

    async function fetchTasks() {
      try {
        const data = await tasksService.list({ projectId });
        if (isMountedRef.current) {
          setTasks(data);
          setError(null);
        }
      } catch (err) {
        if (isMountedRef.current) {
          const message = err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
            : null;
          setError(message || 'Erro ao carregar tarefas');
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    }

    void fetchTasks();

    return () => {
      isMountedRef.current = false;
    };
  }, [projectId]);

  async function createTask(data: CreateTaskData) {
    const newTask = await tasksService.create(data);
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }

  async function updateTask(id: string, data: UpdateTaskData) {
    const updated = await tasksService.update(id, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }

  async function deleteTask(id: string) {
    await tasksService.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask
  };
}