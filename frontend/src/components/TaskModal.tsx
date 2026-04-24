import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { taskSchema } from '../schemas/taskSchema';
import type { TaskFormData } from '../schemas/taskSchema';
import type { Task } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  initialData?: Task | null;
}

const statusOptions = [
  { value: 'todo', label: 'A fazer' },
  { value: 'doing', label: 'Em andamento' },
  { value: 'done', label: 'Concluída' }
];

const priorityOptions = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' }
];

export function TaskModal({ isOpen, onClose, onSubmit, initialData }: TaskModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium'
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: initialData?.title || '',
        description: initialData?.description || '',
        status: initialData?.status || 'todo',
        priority: initialData?.priority || 'medium'
      });
    }
  }, [isOpen, initialData, reset]);

  async function onFormSubmit(data: TaskFormData) {
    try {
      await onSubmit(data);
    } catch (err) {
      console.error('Erro ao salvar tarefa:', err);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar tarefa' : 'Nova tarefa'}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <Input
          label="Título"
          placeholder="O que precisa ser feito?"
          error={errors.title?.message}
          {...register('title')}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição (opcional)
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
            placeholder="Detalhes da tarefa"
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            options={statusOptions}
            error={errors.status?.message}
            {...register('status')}
          />
          <Select
            label="Prioridade"
            options={priorityOptions}
            error={errors.priority?.message}
            {...register('priority')}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialData ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}