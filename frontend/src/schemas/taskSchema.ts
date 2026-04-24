import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(2, 'Título precisa ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  status: z.enum(['todo', 'doing', 'done']),
  priority: z.enum(['low', 'medium', 'high'])
});

export type TaskFormData = z.infer<typeof taskSchema>;