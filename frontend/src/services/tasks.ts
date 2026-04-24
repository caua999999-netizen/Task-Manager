import { api } from './api';
import type { Task } from '../types';

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: 'todo' | 'doing' | 'done';
  priority?: 'low' | 'medium' | 'high';
  projectId: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'todo' | 'doing' | 'done';
  priority?: 'low' | 'medium' | 'high';
}

export interface ListTasksFilters {
  projectId?: string;
  status?: 'todo' | 'doing' | 'done';
  priority?: 'low' | 'medium' | 'high';
}

export const tasksService = {
  async list(filters?: ListTasksFilters): Promise<Task[]> {
    const response = await api.get<Task[]>('/tasks', { params: filters });
    return response.data;
  },

  async getById(id: string): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async create(data: CreateTaskData): Promise<Task> {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  async update(id: string, data: UpdateTaskData): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }
};