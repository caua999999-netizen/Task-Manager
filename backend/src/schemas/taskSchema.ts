import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(2, 'Título precisa ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  status: z.enum(['todo', 'doing', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  projectId: z.string().uuid('projectId inválido')
});

export const updateTaskSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  status: z.enum(['todo', 'doing', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional()
});

export const listTasksQuerySchema = z.object({
  projectId: z.string().uuid().optional(),
  status: z.enum(['todo', 'doing', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional()
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;