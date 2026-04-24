import type { Task } from '../types';
import { Button } from './Button';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: 'todo' | 'doing' | 'done') => void;
}

const priorityStyles = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta'
};

const statusLabels = {
  todo: 'A fazer',
  doing: 'Em andamento',
  done: 'Concluída'
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-semibold ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {task.title}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityStyles[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      )}

      <div className="mb-3">
        <label className="text-xs text-gray-500">Status:</label>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value as 'todo' | 'doing' | 'done')}
          className="ml-2 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="todo">{statusLabels.todo}</option>
          <option value="doing">{statusLabels.doing}</option>
          <option value="done">{statusLabels.done}</option>
        </select>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => onEdit(task)} className="text-sm flex-1">
          Editar
        </Button>
        <Button variant="danger" onClick={() => onDelete(task)} className="text-sm flex-1">
          Deletar
        </Button>
      </div>
    </div>
  );
}