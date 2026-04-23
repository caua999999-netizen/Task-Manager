import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(2, 'Nome precisa ter pelo menos 2 caracteres'),
  description: z.string().optional()
});

export type ProjectFormData = z.infer<typeof projectSchema>;